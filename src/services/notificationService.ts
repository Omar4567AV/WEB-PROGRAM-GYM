/**
 * Notification Service
 * Writes coach-to-client update notifications into localStorage.
 * The client dashboard reads and clears them on next visit.
 */

export type NotificationType = 'program' | 'diet' | 'both';

export interface ClientNotification {
  type: NotificationType;
  updatedAt: string;   // ISO timestamp
  seenAt?: string;     // ISO timestamp, set when client dismisses
}

const KEY = (clientId: string) => `coach_pro_notification_${clientId}`;

export const notificationService = {
  /**
   * Write (or merge) a notification for a specific client.
   * If an unseen notification already exists, merge types into 'both'.
   */
  writeNotification(clientId: string, type: NotificationType): void {
    const existing = notificationService.getNotification(clientId);
    let mergedType: NotificationType = type;

    if (existing && !existing.seenAt) {
      // Merge: if either side has a different type, set 'both'
      if (existing.type !== type) {
        mergedType = 'both';
      }
    }

    const notification: ClientNotification = {
      type: mergedType,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY(clientId), JSON.stringify(notification));
  },

  /**
   * Read any pending (unseen) notification for a client.
   * Returns null if there is no notification or it was already seen.
   */
  getUnseenNotification(clientId: string): ClientNotification | null {
    const notification = notificationService.getNotification(clientId);
    if (!notification || notification.seenAt) return null;
    return notification;
  },

  /**
   * Read the raw notification record (seen or unseen).
   */
  getNotification(clientId: string): ClientNotification | null {
    const raw = localStorage.getItem(KEY(clientId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ClientNotification;
    } catch {
      return null;
    }
  },

  /**
   * Mark a notification as seen (does NOT delete it, preserves history).
   */
  markSeen(clientId: string): void {
    const notification = notificationService.getNotification(clientId);
    if (!notification) return;
    notification.seenAt = new Date().toISOString();
    localStorage.setItem(KEY(clientId), JSON.stringify(notification));
  },

  /**
   * Completely delete the notification record for a client.
   */
  clear(clientId: string): void {
    localStorage.removeItem(KEY(clientId));
  },
};

export default notificationService;
