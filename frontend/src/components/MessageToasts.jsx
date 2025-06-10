// src/components/MessageToasts.jsx
import { Toast, ToastContainer } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collectionGroup,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';

export default function MessageToasts() {
  const [toasts, setToasts] = useState([]);
  const location = useLocation();
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    // Extract chat or group ID from URL
    const match = location.pathname.match(/\/chat\/(.+)/);
    setActiveChatId(match ? match[1] : null);
  }, [location.pathname]);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collectionGroup(db, 'messages'),
      where('to', 'array-contains', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const msg = change.doc.data();
          const parentPath = change.doc.ref.parent.parent?.path;
          const idFromPath = change.doc.ref.parent.parent?.id;

          // Skip toast if the user is currently viewing the same chat/group
          if (idFromPath === activeChatId) return;

          const isGroup = parentPath.startsWith('groups');

          setToasts((prev) => [
            ...prev,
            {
              id: change.doc.id,
              source: isGroup ? `Group: ${msg.groupName || 'Unnamed'}` : `From: ${msg.fromName || 'Unknown'}`,
              text: msg.text || '[Image]',
            },
          ]);
        }
      });
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid, activeChatId]);

  return (
    <ToastContainer position="bottom-end" className="p-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => setToasts((t) => t.filter((ti) => ti.id !== toast.id))}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{toast.source}</strong>
          </Toast.Header>
          <Toast.Body>{toast.text}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
