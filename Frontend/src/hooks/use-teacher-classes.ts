import { useEffect, useState } from "react";
import { fetchTeacherClasses, subscribeTeacherClasses, type TeacherClass } from "@/store/teacherClasses";

export function useTeacherClasses(teacherId: string): TeacherClass[] {
  const [list, setList] = useState<TeacherClass[]>([]);

  useEffect(() => {
    let active = true;
    const reload = () => {
      fetchTeacherClasses(teacherId).then((rows) => {
        if (active) setList(rows);
      });
    };
    reload();
    const unsub = subscribeTeacherClasses(reload);
    return () => {
      active = false;
      unsub();
    };
  }, [teacherId]);

  return list;
}
