import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";

import debounce from "lodash.debounce";

interface Participant {
  id: string;
  name: string;
  editing: boolean;
}

type TParticipantsProps = {
  meetId: string;
};

const sanitizeMeetId = (rawId: string) => rawId.replace(/\//g, "_");

export default function Participants({ meetId }: TParticipantsProps) {
  const safeMeetId = sanitizeMeetId(meetId);
  console.log({ meetId, safeMeetId });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [input, setInput] = useState("");

  const ref = collection(db, "participants", safeMeetId, "list");

  useEffect(() => {
    const q = query(ref, orderBy("createdAt"));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Participant[];
      setParticipants(list);
    });
  }, [safeMeetId]);

  const addParticipant = async () => {
    if (!input.trim()) return;
    await addDoc(ref, { name: input.trim(), createdAt: Date.now() });
    setInput("");
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "participants", meetId, "list", id));
  };

  const toggleEdit = (id: string) => {
    setParticipants((p) =>
      p.map((part) =>
        part.id === id ? { ...part, editing: !part.editing } : part
      )
    );
  };

  const debouncedUpdate = useMemo(() => {
    return debounce(async (id: string, name: string) => {
      await updateDoc(doc(db, "participants", meetId, "list", id), { name });
    }, 500);
  }, [meetId]);

  const handleChange = (id: string, name: string) => {
    setParticipants((p) =>
      p.map((part) => (part.id === id ? { ...part, name } : part))
    );
    debouncedUpdate(id, name);
  };

  return (
    <div className="p-4 bg-white min-h-screen text-gray-800">
      <h1 className="text-xl font-bold mb-4">Участники встречи</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          placeholder="Введите имя"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addParticipant}
          className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
        >
          Добавить
        </button>
      </div>

      <ul className="space-y-2">
        {participants.map((part) => (
          <li key={part.id} className="flex items-center gap-2">
            {part.editing ? (
              <input
                type="text"
                value={part.name}
                onChange={(e) => handleChange(part.id, e.target.value)}
                onBlur={() => toggleEdit(part.id)}
                autoFocus
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              <span
                className="flex-1 cursor-pointer"
                onClick={() => toggleEdit(part.id)}
              >
                {part.name}
              </span>
            )}
            <button
              onClick={() => remove(part.id)}
              className="text-red-500 hover:text-red-700"
              title="Удалить"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
