import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();
  const diffInMilliseconds = currentDate.getTime() - date.getTime();
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInMonths = diffInDays / 30;
  const diffInYears = diffInDays / 365;

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return Math.floor(diffInMinutes) === 1 ? "1 minute ago" : Math.floor(diffInMinutes) + " minutes ago";
  } else if (diffInHours < 24) {
    return Math.floor(diffInHours) === 1 ? "1 hour ago" : Math.floor(diffInHours) + " hours ago";
  } else if (diffInDays < 30) {
    return Math.floor(diffInDays) === 1 ? "1 day ago" : Math.floor(diffInDays) + " days ago";
  } else if (diffInMonths < 12) {
    return Math.floor(diffInMonths) === 1 ? "1 month ago" : Math.floor(diffInMonths) + " months ago";
  } else {
    return Math.floor(diffInYears) === 1 ? "1 year ago" : Math.floor(diffInYears) + " years ago";
  }
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};