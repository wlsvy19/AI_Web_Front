import Vue from "vue";
import { ICodeModel, IPageInfoModel } from "@/models/common-model";
import { Notification } from "element-ui";
import moment from "moment";
export const confirm1 = async (
  v: Vue,
  message,
  title = "info",
  confirmButtonText = "확인",
  cancelButtonText = "취소"
) => {
  try {
    await v.$confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type: "info",
    });

    return true;
  } catch (err) {
    return false;
  }
};

export const date = (dateStr: any) => {
  if (!dateStr) return dateStr;
  if (dateStr.length < 10) return dateStr;
  return dateStr.substring(0, 10);
};

export const alert1 = async (v: Vue, message) => {
  try {
    console.log(Vue.$myGlobal);
    await v.$alert(message);
    return true;
  } catch (err) {
    return false;
  }
};
interface IParam {
  message?: string;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  yes?: Function;
  no?: Function;
}

export const confirmEx = async (
  param: IParam = {
    message: "this is messgaes",
    title: "info",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    yes: Function,
    no: Function,
  }
) => {
  try {
    await window.$nuxt.$confirm(param.message || "", param.title || "", {
      confirmButtonText: param.confirmButtonText,
      cancelButtonText: param.cancelButtonText,
      type: "info",
    });
    if (param.yes) await param.yes();
    return true;
  } catch (err) {
    if (param.no) await param.no();
    return false;
  }
};

export const confirm = async (message: string) => {
  try {
    await window.$nuxt.$confirm("", message, {
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      type: "info",
    });
    return true;
  } catch (err) {
    return false;
  }
};

export const alert = async (message: any) => {
  console.log("window.$nuxt.$alert");
  await window.$nuxt.$alert(message);
  try {
    return true;
  } catch (err) {
    return false;
  }
};

export const comma = (num) => {
  const numberWithCommas = (num) => {
    var parts = num.toString().split(".");
    return (
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (parts[1]
        ? "." + (parts[1].length > 4 ? parts[1].substring(0, 4) : parts[1])
        : "")
    );
  };
  if (num && num != undefined) {
    return numberWithCommas(num);
  }
  return num;
};
export const idPolicy = (value) => {
  const loginIdRex = /^[a-z]+[a-z0-9]{3,30}$/g;
  if (!loginIdRex.test(value)) {
    return false;
  }
  return true;
};
export const pwPolicy = (value) => {
  if (value.match(/[^a-z0-9`~!@@#$%^&*|₩₩₩'₩";:₩/?]/) != null) {
    return false;
  }
  return true;
};
export const checkEmail = (str) => {
  const reg_email =
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  if (!reg_email.test(str)) {
    return false;
  } else {
    return true;
  }
};

export const getPageInitInfo = () => {
  const page: IPageInfoModel = {
    pageNo: 1,
    totalCount: 0,
    pageSize: 20,
  };
  return page;
};

export const getCodeNm = (param: ICodeModel[], value?: string) => {
  if ((param || []) === []) return "";
  if ((value || "") === "") return "";
  const result = param.filter((v) => v.cdV === (value || ""));
  if (result.length > 0) return result[0].cdNm;
  return "";
};

export const getPageTotal = (pageInfo: IPageInfoModel) => {
  console.log("pagePageTotal", pageInfo);
  return pageInfo.totalCount / pageInfo.pageSize + 1;
};

export const enterToBr = (str: string) => {
  return str.replace(/(?:\r\n|\r|\n)/g, "<br />");
};

export const notification = (
  message: string,
  type: string = "info",
  title = "알림",
  duration = 1000
) => {
  Notification.info({
    title,
    message,
    duration,
  });

  if (type === "success")
    Notification.success({
      title,
      message,
      duration,
    });
  if (type === "warning")
    Notification.warning({
      title,
      message,
      duration,
    });
  if (type === "error")
    Notification.error({
      title,
      message,
      duration,
    });
};

// @keypress.native="$util.onlyNumber($event)"
export const onlyNumber = ($event) => {
  //console.log($event.keyCode); //keyCodes value
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    // 46 is dot
    $event.preventDefault();
  }
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const isImageFile = (filename: string) => {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);
};

export const isMobile = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isDesktop = !(
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      ua
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      ua.substr(0, 4)
    )
  );
  return !isDesktop;
};

export const mobileWidth = (width: string) => {
  if (isMobile()) {
    return "100%";
  } else {
    return width;
  }
};

export const menuAccordionClick = () => {
  console.log("closeMenu");
  const body = document.body;
  const len = body.classList.length;
  console.log("ddd", len);
  if (len === 0) body.classList.add("mobile-active");
  else body.classList.remove("mobile-active");
};

export const menuAccordionRemove = () => {
  const body = document.body;
  const len = body.classList.length;
  console.log("ddd", len);
  if (len > 0) body.classList.remove("mobile-active");
};

export const haveAdminPermission = () => {
  return window.$nuxt.$store.getters.isAdmin;
};

export const haveGuestPermission = () => {
  return window.$nuxt.$store.getters.isGuest;
};

export const noPermissionMessage = (type?: string) => {
  notification(`${type} 권한이 없습니다.`);
};

export const today = (type = "S") => {
  if (type === "S") {
    return moment(new Date()).format("YYYY-MM-DD");
  }
  if (type === "L") {
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  }
};
