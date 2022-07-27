// URL 체크
export const isURL = (url: string) => {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
};
// 이메일 체크
export function isEmail(asValue) {
  const regExp =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return regExp.test(asValue);
}

// PW체크 8 ~ 16자 영문, 숫자 조합
export function isPassword(asValue) {
  const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
  return regExp.test(asValue);
}
// PW체크(8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합)
export function isPasswordSpec(asValue) {
  const regExp =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
  return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}
// 핸드폰번호 체크
export function isPhoneNumber(asValue) {
  const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

  return regExp.test(asValue);
}

//아이디 (영문자로 시작하는 영문자 또는 숫자 6~20자 )
export function isId(asValue) {
  const regExp = /^[a-z]+[a-z0-9]{5,19}$/g;
  return regExp.test(asValue);
}
//한글영문
export function isKorAndENg(asValue) {
  var regExp = /^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣 ]*$/;

  return regExp.test(asValue);
}
// 한글입력
export function isKor(asValue) {
  const regExp = /[ㄱ-힣]/;
  return regExp.test(asValue);
}
// 한글, 특수문자만 입력
export function isKorAndSpec(asValue) {
  const regExp = /^[ㄱ-힣\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\" ]*$/;
  return regExp.test(asValue);
}
