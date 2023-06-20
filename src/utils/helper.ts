import dayjs from "dayjs";
import id from "dayjs/locale/id";
import {parseColor} from "tailwindcss/lib/util/color";
import {Pagination} from "./interfaces/table";
import avatarUrl from "../assets/images/avatar.svg";
import {Icon} from "../base-components/Lucide/Lucide.vue";

const formatDate = (format: string, date?: string | Date) => {
  return dayjs(date).locale(id).format(format);
};

const dateTimeFormat = (date?: string | Date) => {
  return formatDate('D MMM YYYY, HH:mm', date)
}

const dateInputFormat = (date?: string | Date) => {
  return formatDate('YYYY-MM-DD', date)
}

const numberFormat = (number: number = 0, decimal: number = 0) => {
  // @ts-ignore
  number = +parseFloat(number).toFixed(decimal)

  const currencyFractionDigits = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).resolvedOptions().maximumFractionDigits;

  return (number).toLocaleString('id-ID', {
    maximumFractionDigits: currencyFractionDigits
  })
}

const toRGB = (value: string) => {
  return parseColor(value).color.join(" ");
};

const slideUp = (
  el: HTMLElement,
  duration = 300,
) => {
  el.style.transitionProperty = "height, margin, padding";
  el.style.transitionDuration = duration + "ms";
  el.style.height = el.offsetHeight + "px";
  el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = "0";
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  el.style.marginTop = "0";
  el.style.marginBottom = "0";
  window.setTimeout(() => {
    el.style.display = "none";
    el.style.removeProperty("height");
    el.style.removeProperty("padding-top");
    el.style.removeProperty("padding-bottom");
    el.style.removeProperty("margin-top");
    el.style.removeProperty("margin-bottom");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition-duration");
    el.style.removeProperty("transition-property");
    // callback(el);
  }, duration);
};

const slideDown = (
  el: HTMLElement,
  duration = 300,
) => {
  el.style.removeProperty("display");
  let display = window.getComputedStyle(el).display;
  if (display === "none") display = "block";
  el.style.display = display;
  const height = el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = "0";
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  el.style.marginTop = "0";
  el.style.marginBottom = "0";
  el.offsetHeight;
  el.style.transitionProperty = "height, margin, padding";
  el.style.transitionDuration = duration + "ms";
  el.style.height = height + "px";
  el.style.removeProperty("padding-top");
  el.style.removeProperty("padding-bottom");
  el.style.removeProperty("margin-top");
  el.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    el.style.removeProperty("height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition-duration");
    el.style.removeProperty("transition-property");
    // callback(el);
  }, duration);
};

const countPaginationNumber = (pagination: Pagination, n: number) => {
  return pagination.per_page * (pagination.page - 1) + n + 1
}

const getFileUrl = (path: string) => {
  return import.meta.env.VITE_API + '/' + path
}

const getUserPhoto = (url = '') => {
  return url ? getFileUrl(url) : avatarUrl
}

const toLowerCase = (string: string, spaceReplace = '_') => {
  return string.replace(/ /g, spaceReplace).toLowerCase()
}

const print = () => {
  const body = document.body
  const html = document.querySelector('html')

  body.classList.add('printing')
  // @ts-ignore
  html.classList.add('printing')

  window.print()

  body.classList.remove('printing')
  // @ts-ignore
  html.classList.remove('printing')
}

const poinIcon = (poin: number): Icon => {
  if (poin >= 300)
    return 'CheckCircle'
  if (poin >= 200)
    return 'ThumbsUp'
  if (poin >= 100)
    return 'Equal'
  if (poin >= 50)
    return 'AlertTriangle'
  return 'Ban'
}

const poinLabel = (poin: number): string => {
  if (poin >= 300)
    return 'Sangat Baik'
  if (poin >= 200)
    return 'Baik'
  if (poin >= 100)
    return 'Cukup'
  if (poin >= 50)
    return 'Peringatan'
  return 'Peringatan'
}

const poinColorClass = (poin: number): string => {
  if (poin >= 100)
    return 'text-success'
  if (poin > 50)
    return 'text-warning'
  return 'text-danger'
}

export {
  formatDate,
  toRGB,
  slideUp,
  slideDown,
  countPaginationNumber,
  numberFormat,
  dateTimeFormat,
  dateInputFormat,
  getFileUrl,
  getUserPhoto,
  toLowerCase,
  print,
  poinIcon,
  poinLabel,
  poinColorClass,
};
