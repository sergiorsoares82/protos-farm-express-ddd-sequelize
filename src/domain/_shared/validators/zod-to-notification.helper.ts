import type { ZodError } from 'zod';
import type { Notification } from './notification';

export function addZodErrorsToNotification(
  zodError: ZodError,
  notification: Notification,
) {
  for (const issue of zodError.errors) {
    if (!issue.message || issue.message.trim() === '') continue; // skip empty messages

    const path =
      Array.isArray(issue.path) && issue.path.length > 0
        ? issue.path.join('.')
        : 'root';

    notification.addError(issue.message, path);
  }
}
