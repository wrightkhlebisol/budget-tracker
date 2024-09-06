export function formatDateToHumanReadable(date) {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now - parsedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return parsedDate > now ? 'Tomorrow' : 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ${parsedDate > now ? 'from now' : 'ago'}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ${parsedDate > now ? 'from now' : 'ago'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ${parsedDate > now ? 'from now' : 'ago'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ${parsedDate > now ? 'from now' : 'ago'}`;
  }
}
