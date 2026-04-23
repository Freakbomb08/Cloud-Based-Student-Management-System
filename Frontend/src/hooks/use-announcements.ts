import { useEffect, useState } from "react";
import { fetchAnnouncements, subscribeAnnouncements, type Announcement } from "@/store/announcements";

export function useAnnouncements(): Announcement[] {
  const [list, setList] = useState<Announcement[]>([]);

  useEffect(() => {
    let active = true;
    const reload = () => {
      fetchAnnouncements().then((rows) => {
        if (active) setList(rows);
      });
    };
    reload();
    const unsub = subscribeAnnouncements(reload);
    return () => {
      active = false;
      unsub();
    };
  }, []);

  return list;
}
