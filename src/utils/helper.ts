import dayjs from "dayjs";
import {parseColor} from "tailwindcss/lib/util/color";
import {Pagination} from "./interfaces/table";

const formatDate = (format: string, date?: string | Date) => {
  return dayjs(date).format(format);
};

const dateTimeFormat = (date?: string | Date) => {
  return formatDate('DD MMM YYYY, HH:mm', date)
}

const dateInputFormat = (date?: string | Date) => {
  return formatDate('YYYY-MM-DD', date)
}

const dateFormat = (date?: string | Date) => {
  return formatDate('D MMM YYYY', date)
}

const timeFormat = (date?: string | Date) => {
  return formatDate('HH:mm', date)
}

const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return "";
  }
};

const onlyNumber = (string: string) => {
  if (string) {
    return string.replace(/\D/g, "");
  } else {
    return "";
  }
};

const isset = (obj: object | string) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === "object" || Array.isArray(obj)) {
      return Object.keys(obj).length;
    } else {
      return obj.toString().length;
    }
  }

  return false;
};

const numberFormat = (number:number = 0, decimal:number = 0) => {
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

const createFormData = (data: any) => {
  const formData = new FormData()

  for (const k in data) {
    formData.append(k, data[k])
  }

  return formData
}

const sortStringArray = (data: any[], key?: string, orderBy = 'asc') => {
  if (key)
    return data.sort((a, b) => orderBy === 'asc' ? a[key].localeCompare(b[key], undefined, {
      numeric: true,
      sensitivity: 'base',
    }) : b[key].localeCompare(a[key], undefined, {
      numeric: true,
      sensitivity: 'base',
    }))

  return data.sort((a, b) => orderBy === 'asc' ? a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  }) : b.localeCompare(a, undefined, {
    numeric: true,
    sensitivity: 'base',
  }))
}

const getFileUrl = (path: string) => {
  return import.meta.env.VITE_FILE_URL + '/' + path
}

const getUserPhoto = (url = '') => {
  return url ? getFileUrl(url) : '/src/assets/images/avatar.svg'
}

const toLowerCase = (string: string, spaceReplace = '_') => {
  return string.replace(/ /g, spaceReplace).toLowerCase()
}

export {
  formatDate,
  capitalizeFirstLetter,
  onlyNumber,
  isset,
  toRGB,
  slideUp,
  slideDown,
  countPaginationNumber,
  createFormData,
  sortStringArray,
  numberFormat,
  dateTimeFormat,
  dateInputFormat,
  dateFormat,
  timeFormat,
  getFileUrl,
  getUserPhoto,
  toLowerCase,
};
