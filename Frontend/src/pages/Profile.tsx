import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Calendar,
  Edit2,
  Eye,
  EyeOff,
  IdCard,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Settings,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalTopbar } from "@/components/PortalTopbar";
import { useAuth } from "@/context/AuthContext";
import { fetchCurrentUser, updateCurrentUser, type SessionUser, type UserRole } from "@/lib/api";

const roleDetails: Record<UserRole, { title: string; profileTitle: string; area: string; status: string }> = {
  student: {
    title: "Student",
    profileTitle: "Student Profile",
    area: "Student Portal",
    status: "ACTIVE STUDENT",
  },
  faculty: {
    title: "Faculty",
    profileTitle: "Faculty Profile",
    area: "Faculty Portal",
    status: "ACTIVE FACULTY",
  },
  admin: {
    title: "Administrator",
    profileTitle: "Admin Profile",
    area: "Administration Portal",
    status: "ADMIN ACCESS",
  },
};

function formatDate(value?: string | null): string {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read selected image."));
    reader.readAsDataURL(file);
  });
}

const Profile = () => {
  const navigate = useNavigate();
  const { firebaseUser, appUser, signOutUser, refreshSession } = useAuth();
  const [profileUser, setProfileUser] = useState<SessionUser | null>(appUser);
  const [profileForm, setProfileForm] = useState({ name: "", phoneNumber: "" });
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    let active = true;

    setProfileUser(appUser);
    setFetchError(null);

    if (!firebaseUser) return () => {
      active = false;
    };

    setIsFetching(true);
    firebaseUser
      .getIdToken(true)
      .then((token) => fetchCurrentUser(token))
      .then((user) => {
        if (active) setProfileUser(user);
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        if (active) {
          setFetchError(error instanceof Error ? error.message : "Unable to fetch profile.");
        }
      })
      .finally(() => {
        if (active) setIsFetching(false);
      });

    return () => {
      active = false;
    };
  }, [appUser, firebaseUser]);

  const user = profileUser ?? appUser;
  const displayName = user?.name || firebaseUser?.displayName || user?.email || firebaseUser?.email || "Portal User";
  const email = user?.email || firebaseUser?.email || "Not available";
  const role = user?.role ?? "student";
  const details = roleDetails[role];
  const accountId = user?.id || firebaseUser?.uid || "Not available";
  const avatarUrl = user?.photoUrl || firebaseUser?.photoURL || null;
  const phoneNumber = user?.phoneNumber || "";
  const createdAt = formatDate(user?.createdAt || firebaseUser?.metadata.creationTime);
  const lastLoginAt = formatDate(user?.lastLoginAt || firebaseUser?.metadata.lastSignInTime);
  const emailStatus = firebaseUser?.emailVerified ? "Verified" : "Not verified";

  const securityTips = useMemo(
    () => [
      "Use at least 12 characters with symbols.",
      "Avoid reusing portal passwords elsewhere.",
      "Ask administration to review access if your role looks wrong.",
    ],
    [],
  );

  useEffect(() => {
    setProfileForm({
      name: displayName === "Portal User" ? "" : displayName,
      phoneNumber,
    });
  }, [displayName, phoneNumber]);

  const saveProfile = async () => {
    if (!firebaseUser) return;

    setIsSaving(true);
    setFetchError(null);
    setProfileMessage(null);

    try {
      const token = await firebaseUser.getIdToken(true);
      const updatedUser = await updateCurrentUser(token, {
        name: profileForm.name,
        phoneNumber: profileForm.phoneNumber || null,
      });
      setProfileUser(updatedUser);
      await refreshSession();
      setProfileMessage("Profile updated in local PostgreSQL.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile.";
      setFetchError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !firebaseUser) return;

    if (!file.type.startsWith("image/")) {
      setFetchError("Please choose an image file.");
      return;
    }

    if (file.size > 750 * 1024) {
      setFetchError("Profile photo must be 750 KB or smaller.");
      return;
    }

    setIsUploadingPhoto(true);
    setFetchError(null);
    setProfileMessage(null);

    try {
      const photoUrl = await readFileAsDataUrl(file);
      const token = await firebaseUser.getIdToken(true);
      const updatedUser = await updateCurrentUser(token, { photoUrl });
      setProfileUser(updatedUser);
      await refreshSession();
      setProfileMessage("Profile photo saved in local PostgreSQL.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile photo.";
      setFetchError(message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <PortalTopbar />
      <input
        id="profile-photo-input"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={updateProfilePhoto}
      />

      <div className="lg:hidden bg-surface min-h-screen">
        <div className="flex items-center justify-between px-5 pt-5">
          <button onClick={() => navigate(-1)} className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </button>
          <h1 className="font-display font-extrabold text-xl text-primary">{details.profileTitle}</h1>
          <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
            <Settings className="h-5 w-5 text-primary" />
          </button>
        </div>

        <div className="px-5 mt-5 space-y-7 pb-24">
          <section className="rounded-2xl bg-gradient-primary text-primary-foreground p-5 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-secondary/10 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative flex items-center gap-4">
              <Avatar name={displayName} src={avatarUrl} size="mobile" />
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-extrabold text-2xl truncate">{displayName}</h2>
                <p className="text-xs opacity-80 mt-0.5">ID: {accountId}</p>
                <span className="mt-2 inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[11px] tracking-[0.2em] font-bold ring-1 ring-secondary/40">
                  {details.status}
                </span>
              </div>
            </div>
            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <Button asChild variant="gold" className={`w-full ${isUploadingPhoto ? "pointer-events-none opacity-70" : ""}`}>
                <label htmlFor="profile-photo-input">
                  <Camera /> {isUploadingPhoto ? "Saving..." : "Photo"}
                </label>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="w-full bg-transparent text-primary-foreground ghost-border hover:bg-primary-foreground/10">
                <LogOut /> Sign Out
              </Button>
            </div>
          </section>

          {fetchError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {fetchError}
            </div>
          )}
          {profileMessage && (
            <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              {profileMessage}
            </div>
          )}

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-extrabold text-2xl text-primary">Account Info</h3>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-[0.18em]">IITM JANAKPURI</span>
            </div>
            <InfoCard icon={<ShieldCheck className="h-5 w-5" />} label="ACCESS ROLE" value={details.title} />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SmallStat label="CREATED" value={createdAt} />
              <SmallStat label="LAST LOGIN" value={lastLoginAt} />
            </div>
          </section>

          <section>
            <h3 className="font-display font-extrabold text-2xl text-primary mb-3">Personal Details</h3>
            <div className="space-y-3">
              <MobileInfoRow icon={<Mail className="h-5 w-5" />} label="EMAIL ADDRESS" value={email} />
              <MobileInfoRow icon={<IdCard className="h-5 w-5" />} label="FIREBASE UID" value={accountId} />
              <MobileInfoRow icon={<Shield className="h-5 w-5" />} label="EMAIL STATUS" value={emailStatus} />
              <MobileInfoRow icon={<Phone className="h-5 w-5" />} label="PHONE NUMBER" value={phoneNumber || "Not provided"} />
            </div>
          </section>

          <section>
            <h3 className="font-display font-extrabold text-2xl text-primary mb-3">Update Profile</h3>
            <div className="space-y-3">
              <ProfileInput
                label="DISPLAY NAME"
                value={profileForm.name}
                onChange={(value) => setProfileForm((current) => ({ ...current, name: value }))}
              />
              <ProfileInput
                label="PHONE NUMBER"
                value={profileForm.phoneNumber}
                onChange={(value) => setProfileForm((current) => ({ ...current, phoneNumber: value }))}
                placeholder="+91 98765 43210"
              />
              <Button variant="primary" className="w-full" onClick={saveProfile} disabled={isSaving}>
                <Edit2 /> {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </section>

          <section>
            <h3 className="font-display font-extrabold text-2xl text-primary mb-3">Security</h3>
            <InfoCard
              icon={isFetching ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
              label="SESSION SOURCE"
              value={isFetching ? "Fetching latest profile..." : "Firebase + PostgreSQL"}
            />
          </section>
        </div>
      </div>

      <div className="hidden lg:block px-10 pb-12">
        <header className="pt-2 pb-8 max-w-3xl">
          <h1 className="font-display font-extrabold text-display-lg tracking-tight text-primary">{details.profileTitle}</h1>
          <p className="mt-3 text-muted-foreground text-base max-w-xl">
            This page is populated from your authenticated Firebase session and the synced PostgreSQL user record.
          </p>
        </header>

        {fetchError && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {fetchError}
          </div>
        )}
        {profileMessage && (
          <div className="mb-6 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            {profileMessage}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 space-y-6">
            <section className="bg-surface-lowest rounded-2xl p-8 shadow-card text-center">
              <div className="relative inline-block">
                <Avatar name={displayName} src={avatarUrl} size="desktop" />
                <label
                  htmlFor="profile-photo-input"
                  className="absolute -bottom-2 -right-2 grid place-items-center h-10 w-10 rounded-xl bg-secondary text-secondary-foreground shadow-card hover:brightness-105 cursor-pointer"
                  aria-label="Change profile photo"
                >
                  {isUploadingPhoto ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </label>
              </div>
              <h2 className="mt-5 font-display font-extrabold text-3xl text-primary">{displayName}</h2>
              <p className="mt-1 text-muted-foreground">{details.area}</p>
              <div className="mt-5 flex flex-col items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] tracking-[0.18em] font-bold">
                  {details.status}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] tracking-[0.18em] font-bold">
                  {emailStatus.toUpperCase()}
                </span>
              </div>
            </section>

            <section className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 shadow-card relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-secondary/10" />
              <div className="relative flex items-center justify-between">
                <p className="text-[11px] tracking-[0.22em] font-bold opacity-80">ACCOUNT ROLE</p>
                <span className="grid place-items-center h-9 w-9 rounded-md bg-primary-foreground/15">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>
              <p className="relative mt-4 font-display font-extrabold text-4xl">{details.title}</p>
              <p className="relative mt-3 text-sm text-primary-foreground/75">Last login: {lastLoginAt}</p>
            </section>
          </div>

          <div className="col-span-8 space-y-6">
            <section className="bg-surface-lowest rounded-2xl p-8 shadow-card">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-12 w-12 rounded-xl bg-secondary text-secondary-foreground">
                    <User className="h-5 w-5" />
                  </span>
                  <h3 className="font-display font-extrabold text-3xl text-primary">Personal Info</h3>
                </div>
                <span className="text-sm font-bold text-muted-foreground">
                  {isFetching ? "Refreshing..." : "Synced"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <DesktopField icon={<Mail className="h-4 w-4" />} label="EMAIL ADDRESS" value={email} />
                <DesktopField icon={<IdCard className="h-4 w-4" />} label="USER ID" value={accountId} />
                <DesktopField icon={<Shield className="h-4 w-4" />} label="ROLE" value={details.title} />
                <DesktopField icon={<Phone className="h-4 w-4" />} label="PHONE NUMBER" value={phoneNumber || "Not provided"} />
              </div>

              <div className="mt-6 bg-surface rounded-xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <ProfileInput
                    label="DISPLAY NAME"
                    value={profileForm.name}
                    onChange={(value) => setProfileForm((current) => ({ ...current, name: value }))}
                  />
                  <ProfileInput
                    label="PHONE NUMBER"
                    value={profileForm.phoneNumber}
                    onChange={(value) => setProfileForm((current) => ({ ...current, phoneNumber: value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">PROFILE SOURCE</p>
                    <p className="mt-1 font-display font-bold text-primary">Firebase Authentication</p>
                  </div>
                  <Button variant="primary" onClick={saveProfile} disabled={isSaving}>
                    <Edit2 /> {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </section>

            <section className="bg-surface-lowest rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-destructive/15 text-destructive">
                  <Shield className="h-5 w-5" />
                </span>
                <h3 className="font-display font-extrabold text-3xl text-primary">Security</h3>
              </div>
              <p className="mt-2 text-muted-foreground max-w-md">
                Update your account password through Firebase Authentication to protect portal access.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <form className="space-y-5">
                  <PasswordField id="cur" label="Current Password" show={showCurrent} onToggle={() => setShowCurrent((s) => !s)} />
                  <PasswordField id="new" label="New Password" show={showNew} onToggle={() => setShowNew((s) => !s)} />
                  <Button variant="primary" size="lg" type="button" disabled>Update Password</Button>
                </form>

                <aside className="bg-surface rounded-xl p-6 border-l-4 border-secondary">
                  <h4 className="font-display font-extrabold text-primary text-lg">Security Recommendations</h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    {securityTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-foreground">
                        <span className="grid place-items-center h-5 w-5 rounded-full bg-secondary/30 text-secondary-foreground shrink-0 mt-0.5">
                          <ShieldCheck className="h-3 w-3" />
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 ghost-border border-t flex justify-between items-center text-xs">
                    <span className="tracking-[0.2em] font-bold text-muted-foreground">LAST LOGIN</span>
                    <span className="font-semibold text-foreground">{lastLoginAt}</span>
                  </div>
                </aside>
              </div>

              <div className="mt-8 flex justify-end">
                <Button variant="outline" size="lg" onClick={handleSignOut}>
                  <LogOut /> Sign Out
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

function Avatar({ name, src, size }: { name: string; src: string | null; size: "mobile" | "desktop" }) {
  const className =
    size === "mobile"
      ? "h-20 w-20 rounded-2xl text-2xl"
      : "h-36 w-36 rounded-2xl text-4xl";

  if (src) {
    return <img src={src} alt={name} className={`${className} object-cover ring-4 ring-surface-low`} />;
  }

  return (
    <span className={`${className} inline-grid place-items-center bg-primary-fixed text-on-primary-fixed font-display font-extrabold ring-4 ring-surface-low`}>
      {getInitials(name)}
    </span>
  );
}

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface-lowest rounded-xl p-4 shadow-card flex items-center gap-3">
      <span className="grid place-items-center h-12 w-12 rounded-lg bg-primary-fixed text-on-primary-fixed">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">{label}</p>
        <p className="font-display font-extrabold text-primary leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-lowest rounded-xl p-4 shadow-card">
      <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-display font-extrabold text-lg text-primary break-words">{value}</p>
    </div>
  );
}

function DesktopField({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2 text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        <p className="font-display font-bold text-primary break-all">{value}</p>
      </div>
    </div>
  );
}

function MobileInfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface-lowest rounded-xl p-4 shadow-card flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">{label}</p>
        <p className="font-display font-bold text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-md bg-surface-high px-4 text-foreground outline-none ghost-border focus:bg-surface-lowest focus:shadow-[inset_0_-2px_0_0_hsl(var(--primary))]"
      />
    </label>
  );
}

function PasswordField({ id, label, show, onToggle }: { id: string; label: string; show: boolean; onToggle: () => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</label>
      <div className="mt-2 flex items-center gap-3 bg-surface-high rounded-md h-12 px-4 ghost-border focus-within:bg-surface-lowest focus-within:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] transition-colors">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="flex-1 bg-transparent outline-none text-foreground"
          autoComplete={id === "cur" ? "current-password" : "new-password"}
        />
        <button type="button" onClick={onToggle} className="text-muted-foreground hover:text-primary">
          {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default Profile;
