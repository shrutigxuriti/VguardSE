// const imageBaseUrl =  "https://vguardrishta.com/";
const imageBaseUrl = "http://34.100.133.239/";

export function getImageUrl(uuid, folderName) {
  let baseUrl = imageBaseUrl;

  switch (folderName) {
    case 'Profile':
      baseUrl += 'retimg/appImages/Profile/';
      break;
    case 'Cheque':
      baseUrl += 'img/appImages/Cheque/';
      break;
    case 'IdCard':
      baseUrl += 'img/appImages/IdCard/';
      break;
    case 'PanCard':
      baseUrl += 'img/appImages/PanCard/';
      break;
    case 'GST':
      baseUrl += 'img/appImages/GST/';
      break;
    default:
      break;
  }

  return `${baseUrl}${uuid}`;
}
