import { useEffect, useState } from "react";
import { fetchAssignments, subscribeAssignments, type Assignment } from "@/store/assignments";

export function useAssignments(): Assignment[] {
  const [list, setList] = useState<Assignment[]>([]);

  useEffect(() => {
    let active = true;
    fetchAssignments().then((rows) => {
      if (active) setList(rows);
    });
    const unsub = subscribeAssignments(() => {
      fetchAssignments().then((rows) => {
        if (active) setList(rows);
      });
    });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  return list;
}
