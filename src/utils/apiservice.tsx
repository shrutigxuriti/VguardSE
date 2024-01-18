import axios from 'axios';
import digestFetch from 'react-native-digest-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
import DigestClient from 'digest-fetch';

const BASE_URL = 'http://34.100.133.239:18092/vguard/api/';

// const BASE_URL = 'http://202.66.175.34:18091/vguard/api/';

const TEST_BASE_URL = 'http://192.168.29.60:5000/vguard/api/';

export const createDigestGetRequest = async (relativeUrl = {}) => {
    try {
        const url = BASE_URL + relativeUrl;
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const authType = await AsyncStorage.getItem('authtype');

        const headers = {
            Authtype: authType,
        };

        console.log(username, ":::", password, ":::", authType)

        if (username && password && authType) {
            // const response = await digestFetch(url, {
            //     method: 'GET',
            //     headers,
            //     username,
            //     password,
            // });
            const client = new DigestClient(username, password)
            const response = await client.fetch(url)

            console.log("RESPONSE<><><apiservice", response);

            return response;
        } else {
            throw new Error('Username and/or password not found in AsyncStorage.');
        }
    } catch (error) {
        throw error;
    }
};

export const createDigestPostRequest = async (relativeUrl = {}, data: any) => {
    try {
        const url = BASE_URL + relativeUrl;

        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const authType = await AsyncStorage.getItem('authtype');

        const headers = {
            'Content-Type': 'application/json',
            Authtype: authType,
        };

        if (username && password && authType) {
            const response = await digestFetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
                username,
                password,
            });
            return response;
        } else {
            throw new Error('Username and/or password not found in AsyncStorage.');
        }
    } catch (error) {
        throw error;
    }
};

export const createPostRequest = async (relativeUrl: string, data: any) => {
    console.log("DATA", data)
    try {
        const response = await api.post(relativeUrl, data);
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createGetRequest = async (relativeUrl: string) => {
    try {
        const response = await api.get(relativeUrl);
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const testingcreateGetRequest = async (relativeUrl = {}) => {
    try {
        const url = TEST_BASE_URL + relativeUrl;
        // const url = BASE_URL + relativeUrl;
        console.log('URL-------------------', url);

        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const authType = await AsyncStorage.getItem('authtype');

        const headers = {
            'Content-Type': 'application/json',
            Authtype: authType,
        };

        if (username && password && authType) {
            const response = await digestFetch(url, {
                method: 'GET',
                headers,
                username,
                password,
            });
            return response;
        } else {
            throw new Error('Username and/or password not found in AsyncStorage.');
        }
    } catch (error) {
        throw error;
    }
};

export const createDigestPutRequest = async (relativeUrl = {}, data: any) => {
    try {
        const url = BASE_URL + relativeUrl;
        const headers = {
            'Content-Type': 'application/json',
        };

        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');

        if (username && password) {
            const response = await digestFetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
                username,
                password,
            });

            return response;
        } else {
            throw new Error('Username and/or password not found in AsyncStorage.');
        }
    } catch (error) {
        throw error;
    }
};

export const loginPasswordDigest = async (
    relativeUrl: string,
    username: string,
    password: string,
) => {
    try {
        const data = {
            userName: username,
            password: password,
        };

        const url = BASE_URL + relativeUrl;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        await AsyncStorage.clear();

        const response = await axios.post(url, data, {
            headers: headers,
        });

        if (response.status === 200) {
            const resp = response.data;
            const userName = resp.userId;
            const Password = resp.password;
            await AsyncStorage.setItem('username', userName);
            await AsyncStorage.setItem('password', Password);
            await AsyncStorage.setItem('authtype', 'password');
            console.log(resp, '<><><<><<><<><>USERNAME');
            console.log("<><><><><><><")
            // await update_fcm_token();
        }

        console.log("RESPONSE<><><", response.data)

        return response;
    } catch (error) {
        throw error;
    }
};

export const loginOtpDigest = async (
    relativeUrl: string,
    username: string,
    password: string,
) => {
    try {
        console.log("LOGGING IN")
        const url = BASE_URL + relativeUrl;
        await AsyncStorage.clear();
        const headers = {
            Authtype: 'otp',
        };
        const client = new DigestClient(username, password, headers)
        const basicAuthHeaders = client.addBasicAuth();

        const customHeaders = {
            ...basicAuthHeaders.headers,
            Authtype: 'otp',
        };

        console.log("HEADERS", customHeaders);

        const response = await client.fetch(url, {
            method: 'GET',
            headers: customHeaders,
        });

        console.log("RESPONSE", response)

        if (response.status === 200) {
            const resp = response.json();
            const userName = resp.userId;
            const Password = resp.password;
            console.log(resp, '<><><<><<><<><>USERNAME');
            await AsyncStorage.setItem('username', userName);
            await AsyncStorage.setItem('password', Password);
            await AsyncStorage.setItem('authtype', 'password');
            // await update_fcm_token();
        }

        return response;
    } catch (error) {
        throw error;
    }
};

// const update_fcm_token = async () => {
//     const path = 'pushNotification/registerToken';
//     try {
//         let fcmtoken = await messaging().getToken();
//         if (fcmtoken) {
//             let body = {
//                 fcmToken: fcmtoken,
//             };
//             await createDigestPostRequest(path, body);
//         } else {
//             console.log('Error : Issue in firebase FCM generater, ', fcmtoken);
//         }
//     } catch (e) {
//         console.log('Error : ', e);
//     }
// };
export function loginWithPassword(username: string, password: string) {
    const path = 'user/loginWithSp';
    return loginPasswordDigest(path, username, password);
}
export function loginWithOtp(username: string, otp: string) {
    const path = 'user/userDetails';
    console.log('<><><><', username);
    return loginOtpDigest(path, username, otp);
}

interface NewUserOtpValidationResponse {
    data: {
        message: string;
    };
}

const api = axios.create({
    baseURL: BASE_URL,
});
const testapi = axios.create({
    baseURL: TEST_BASE_URL,
});

export const Newuserotpvalidation = async (
    mobileNo: string,
    otp: string,
): Promise<NewUserOtpValidationResponse> => {
    try {
        const requestBody = {
            mobileNo: mobileNo,
            otp: otp,
        };
        console.log({ mobileNo, otp });
        const response = await api.post('user/validateNewUserOtp', {
            mobileNo: mobileNo,
            otp: otp,
        });

        return response.data as NewUserOtpValidationResponse;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export function getUsers(filter: string) {
    const path = 'user/';
    return createDigestPostRequest(path, filter);
}

export function getFile(uuid: String, imageRelated: String, userRole: String) {
    const path = `file/${uuid}/${imageRelated}/${userRole}`;
    console.log(path);
    return createDigestGetRequest(path);
}

export const sendFile = (formData: FormData): Promise<any> => {
    console.log(formData);
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    return api
        .post('file', formData, config)
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            throw error;
        });
};

export function getDistributorList() {
    const path = 'user/dist/';
    return createDigestGetRequest(path);
}

export function getTransactions(filter: string) {
    const path = 'transaction/';
    return createDigestPostRequest(path, filter);
}

export function getRedemptionList(filter: string) {
    const path = 'redemption/history';
    return createDigestPostRequest(path, filter);
}

export function getProductCategoryList() {
    const path = 'product/categories';
    return createDigestGetRequest(path);
}

export function getProductListing(productRequest: string) {
    const path = 'product/catalog';
    return createDigestPostRequest(path, productRequest);
}

export function getStates() {
    const path = 'state/';
    return createGetRequest(path);
}

export function getDistricts(stateId: string) {
    const path = `district/${stateId}`;
    return createGetRequest(path);
}

export function getCities(districtId: string) {
    const path = `city/${districtId}`;
    return createGetRequest(path);
}

export function checkMobileNumber(user: string) {
    const path = 'user/checkMobileNo';
    return createDigestPostRequest(path, user);
}

export function generateOtp(user: string) {
    const path = 'user/generateOtp';
    return createDigestPostRequest(path, user);
}

export function sendUser(user: string) {
    const path = 'user/signUp';
    return createDigestPostRequest(path, user);
}

export function verifyOTP(user: string) {
    const path = 'user/verifyOtp';
    return createDigestPostRequest(path, user);
}

export function redeem(redemption: string) {
    const path = 'redemption';
    return createDigestPostRequest(path, redemption);
}

export function reLogin() {
    const path = 'user/relogin';
    return createDigestGetRequest(path);
}

export function captureSale(couponDataList: any) {
    const path = 'coupon/process';
    return createDigestPostRequest(path, couponDataList);
}

export function sendCouponPin(couponDataList: any) {
    const path = 'coupon/processForPin';
    return createDigestPostRequest(path, couponDataList);
}

export function getUserByMobile(mobileNo: string) {
    const path = `user/${mobileNo}`;
    return createDigestGetRequest(path);
}

export function uploadOrder(order: string) {
    const path = 'order';
    return createDigestPostRequest(path, order);
}

export function getOrders() {
    const path = 'order/';
    return createDigestGetRequest(path);
}

export function searchCoupon(coupon: string) {
    const path = `coupon/${coupon}`;
    return createDigestGetRequest(path);
}

export function getCategoryList() {
    const path = 'product/categories';
    return createDigestGetRequest(path);
}

export function getDownloads() {
    const path = 'product/getDownloadsData';
    return createDigestGetRequest(path);
}

export function getAppVersion() {
    const path = 'user/retversion';
    return createGetRequest(path);
}

export function updateUser(data: any) {
    const path = 'user/update';
    return createDigestPutRequest(path, data);
}

export function getPackCategoryList() {
    const path = 'pack/category';
    return createDigestGetRequest(path);
}

export function getPackProductListing(categoryId: number) {
    const path = `pack/category/${categoryId}`;
    return createDigestGetRequest(path);
}

export function updateToken(token: string) {
    const path = 'user/update/token';
    return createDigestPutRequest(path, token);
}

export function getCouponList() {
    const path = 'couponList/';
    return createDigestGetRequest(path);
}

export function changePassword(changePassword: string) {
    const path = 'user/changePassword';
    return createDigestPutRequest(path, changePassword);
}

export function updateanys(data: any) {
    const path = 'user/updateanys';
    return createDigestPostRequest(path, data);
}

export function getByIfsc(ifscCode: string) {
    const path = `bank/${ifscCode}`;
    return createDigestGetRequest(path);
}

export function updateOrder(token: number) {
    const path = 'order/update';
    return createDigestPostRequest(path, token);
}

export function getTerritoryManager(filter: string) {
    const path = 'user/tm/';
    return createDigestPostRequest(path, filter);
}

export function getDistrictMaster(stateId: number) {
    const path = `user/tm/district/${stateId}`;
    return createDigestGetRequest(path);
}

export function uploadInvoice(invoice: string) {
    const path = 'invoice';
    return createDigestPostRequest(path, invoice);
}

export function getInvoiceList() {
    const path = 'invoice/';
    return createDigestGetRequest(path);
}

export function loadContestDetails(apmId: number, mobileNo: string) {
    const path = `displayContest/load/${apmId}/${mobileNo}`;
    return createDigestGetRequest(path);
}

export function createDisplayContest(displayContest: string) {
    const path = 'displayContest/createContest';
    return createDigestPostRequest(path, displayContest);
}

export function getSelectedSegmentProducts(
    segment: string,
    categoryId: number,
) {
    const path = `pack/selectedProducts/${segment}/${categoryId}`;
    return createDigestGetRequest(path);
}

export function getVehicleSegment() {
    const path = 'pack/vehicleSegment';
    return createDigestGetRequest(path);
}

export function sendAccessoryCoupon(couponDataList: any) {
    const path = 'coupon/accessory';
    return createDigestPostRequest(path, couponDataList);
}

export function getDetails() {
    const path = 'user/upseDetails';
    return createDigestGetRequest(path);
}

export function submitDetails(target: number) {
    const path = `user/upseDetails/${target}`;
    return createDigestGetRequest(path);
}

export function fetchPendingApproval(screen: string) {
    const path = `redemption/pendingApproval/${screen}`;
    return createDigestGetRequest(path);
}

export function updatePendingApproval(redemptionOrder: any) {
    const path = 'redemption/pendingApproval/update';
    return createDigestPostRequest(path, redemptionOrder);
}

export function updateLogoutStatus() {
    const path = 'user/logoutStatus';
    return createDigestGetRequest(path);
}

export function getUser() {
    console.log("GETTING USER")
    const path = 'user/userDetails';
    const createDigestGetRequest = async (relativeUrl = {}) => {
        try {
            const url = BASE_URL + relativeUrl;
            const username = await AsyncStorage.getItem('username');
            const password = await AsyncStorage.getItem('password');
            const authType = await AsyncStorage.getItem('authtype');

            const headers = {
                Authtype: authType,
            };

            console.log(username, ":::", password, ":::", authType)

            if (username && password && authType) {
                console.log(authType, "AUTHTYPE");
                const client = new DigestClient(username, password, headers)
                const basicAuthHeaders = client.addBasicAuth();

                const customHeaders = {
                    ...basicAuthHeaders.headers,
                    Authtype: authType,
                };

                const response = await client.fetch(url, {
                    method: 'GET',
                    headers: customHeaders,
                });
                console.log("RESPONSE", response);
                return response;
            } else {
                throw new Error('Username and/or password not found in AsyncStorage.');
            }
        } catch (error) {
            throw error;
        }
    };
    return createDigestGetRequest(path);
}

export function userLoginDetails() {
    const path = 'user/userDetails/login';
    return createDigestGetRequest(path);
}

export function registerNewUser(vguardRishtaUser: any) {
    const path = 'user/registerUser';
    return createDigestPostRequest(path, vguardRishtaUser);
}

export function updateKyc(kycDetails: any) {
    const path = 'user/updateKyc';
    return createDigestPostRequest(path, kycDetails);
}

export function updateKycReatiler(kycDetails: any) {
    console.log('KYC Details', kycDetails);
    const path = 'user/updateKycReatiler';
    return createDigestPostRequest(path, kycDetails);
}

export function addToCart(productDetail: any) {
    const path = 'product/addToCart';
    return createDigestPostRequest(path, productDetail);
}

export function removeFromCart(productDetail: any) {
    const path = 'product/removeFromCart';
    return createDigestPostRequest(path, productDetail);
}

export function bankTranfer(productOrder: any) {
    const path = 'order/bankTransfer';
    return createDigestPostRequest(path, productOrder);
}

export function productOrder(productOrder: any) {
    const path = 'order/product';
    return createDigestPostRequest(path, productOrder);
}

export function paytmTransfer(productOrder: any) {
    const path = 'order/paytmTransfer';
    return createDigestPostRequest(path, productOrder);
}

export function paytmTransferForAirCooler(productOrder: any) {
    const path = 'order/paytmTransferAircooler';
    return createDigestPostRequest(path, productOrder);
}

export function getCartItems() {
    const path = 'product/getCartProducts';
    return createDigestGetRequest(path);
}

export function getPaytmPrdouctId() {
    const path = 'product/getPaytmProductId';
    return createDigestGetRequest(path);
}

export function getBankProductId() {
    const path = 'product/getBankProductId';
    return createDigestGetRequest(path);
}

export function getShippingAddress() {
    const path = 'user/shippingAddress';
    return createDigestGetRequest(path);
}

export function getTicketTypes() {
    const path = 'ticket/types';
    return createDigestGetRequest(path);
}

export function sendTicket(data: any) {
    const path = "ticket/create";
    return createPostRequest(path, data);
}

export function getWhatsNew() {
    const path = 'whatsNew/';
    return createDigestGetRequest(path);
}

export function getSchemeImages() {
    const path = 'schemes/';
    return createDigestGetRequest(path);
}

export function getInfoDeskBanners() {
    const path = 'infoDesk/banners';
    return createDigestGetRequest(path);
}

export function getTicketHistory() {
    const path = 'ticket/history';
    return createDigestGetRequest(path);
}

export function getNotifications() {
    const path = 'alert/';
    return createDigestGetRequest(path);
}

export function getKycIdTypes() {
    const path = 'user/kycIdTypes';
    return createDigestGetRequest(path);
}

export function getKycIdTypesByLang(selectedLangId: number) {
    const path = `user/kycIdTypes/${selectedLangId}`;
    return createDigestGetRequest(path);
}

export function validateNewMobileNo(vru: any) {
    const path = 'user/validateNewMobileNo';
    return createDigestPostRequest(path, vru);
}

export function validateOtp(vguardRishtaUser: any) {
    const path = 'user/validateNewUserOtp';
    return createDigestPostRequest(path, vguardRishtaUser);
}

export function getRishtaUserProfile() {
    const path = 'user/profile';
    return createDigestGetRequest(path);
}

export function getBonusRewards() {
    const path = 'user/bonusPoints';
    return createDigestGetRequest(path);
}

export function getProductWiseOffers() {
    const path = 'product/productWiseOffers';
    return createDigestGetRequest(path);
}

export function getRedemptionHistory(type: string) {
    const path = `product/redemptionHistory?type=${type}`;
    return createDigestGetRequest(path);
}

export function forgotPassword(number: string) {
    const path = 'user/forgotPassword';
    const body = {
        mobileNo: number,
    };
    return createPostRequest(path, body);
}

export function getScanCodeHistory() {
    const path = 'coupon/history';
    return createDigestGetRequest(path);
}

export function generateOtpForLogin(body: any) {
    const path = 'user/generateOtpForLogin';
    return createPostRequest(path, body);
}

export function generateOtpForReverify(vru: any) {
    const path = 'user/generateOtpForReverify';
    return createPostRequest(path, vru);
}

export function validateReverifyOtp(vguardRishtaUser: any) {
    const path = 'user/validateReverifyOtp';
    return createPostRequest(path, vguardRishtaUser);
}

export function validateLoginOtp(body: any) {
    console.log('body----', body);
    const path = 'user/validateLoginOtp';
    return createPostRequest(path, body);
}

export function updateProfile(vru: any) {
    const path = 'user/updateProfile';
    return createDigestPostRequest(path, vru);
}

export function updateBank(bankDetail: any) {
    const path = 'user/updateBank';
    return createDigestPostRequest(path, bankDetail);
}

export function getProductWiseOffersDetail(offerId: string) {
    const path = `product/productWiseOffers/${offerId}`;
    return createDigestGetRequest(path);
}

export function getProdWiseEarning() {
    const path = 'product/getProductWiseEarning';
    return createDigestGetRequest(path);
}

export function getReferralName(referralCode: string) {
    const path = `user/getReferralName/${referralCode}`;
    return createDigestGetRequest(path);
}

export function getMonthWiseEarning(month: string, year: string) {
    const path = `user/monthWiseEarning/${month}/${year}`;
    return createDigestGetRequest(path);
}

export function getBonusPoints(transactionId: string) {
    const path = `coupon/getBonusPoint/${transactionId}`;
    return createDigestGetRequest(path);
}

export function getany() {
    const path = 'user/bankDetails';
    return createDigestGetRequest(path);
}

export function getBanks() {
    const path = 'banks/';
    return createDigestGetRequest(path);
    // return testingcreateGetRequest(path);
}

export function getKycDetails() {
    const path = 'user/kycDetails';
    return createDigestGetRequest(path);
}

export function reUpdateUserForKyc(vru: any) {
    const path = 'user/reUpdateUserForKyc';
    return createDigestPostRequest(path, vru);
}

export function getSchemeWiseEarning() {
    const path = 'schemes/getSchemeWiseEarning';
    return createDigestGetRequest(path);
}

export function getProfession(isService: number) {
    const path = `user/getProfession/${isService}`;
    return createDigestGetRequest(path);
}

export function getSubProfessions(professionId: string) {
    const path = `user/getSubProfession/${professionId}`;
    return createDigestGetRequest(path);
}

export function logoutUser() {
    const path = 'user/logoutUser';
    return createDigestPostRequest(path, '');
}

export function getDetailsByPinCode(pinCode: string) {
    const path = `state/detailByPincode/${pinCode}`;
    return createGetRequest(path);
}

export function getCitiesByPincodeId(pinCodeId: number) {
    const path = `state/citiesByPincodeId/${pinCodeId}`;
    return createDigestGetRequest(path);
}

export function getPincodeList(pinCode: string) {
    const path = `state/pinCodeList/${pinCode}`;
    console.log('<><><', pinCode);
    return createGetRequest(path);
}

export function getVguardInfoDownloads() {
    const path = 'product/getVguardInfoDownloads';
    return createDigestGetRequest(path);
}

export function getVguardProdCatalog() {
    const path = 'product/getVguardProdCatalog';
    return createDigestGetRequest(path);
}

export function getActiveSchemeOffers() {
    const path = 'schemes/getActiveSchemeOffers';
    return createDigestGetRequest(path);
}

export function setSelectedLangId(vguardRishtaUser: any) {
    const path = 'user/updateLanguageId';
    return createDigestPostRequest(path, vguardRishtaUser);
}

export function getNotificationCount() {
    const path = 'alert/count';
    return createDigestGetRequest(path);
}

export function updateReadCheck(notifications: any) {
    const path = 'alert/updateReadCheck';
    return createDigestPostRequest(path, notifications);
}

export function processErrorCoupon(ec: any) {
    const path = 'coupon/processErrorCoupon';
    return createDigestPostRequest(path, ec);
}

export function getRetProductCategories() {
    const path = 'product/retailerCategories';
    return createDigestGetRequest(path);
}

export function getTierDetail() {
    const path = 'user/getTierDetail';
    return createDigestGetRequest(path);
}

export function getRetailerCategoryDealIn() {
    const path = 'product/retCategoryDealIn';
    return createDigestGetRequest(path);
}

export function getWelfarePdfList() {
    const path = 'welfare/';
    return createDigestGetRequest(path);
}

export function registerToken(vru: any) {
    const path = 'pushNotification/registerToken';
    return createDigestPostRequest(path, vru);
}

export function getPushNotifications() {
    const path = 'pushNotification/list';
    return createDigestGetRequest(path);
}

export function getCustDetByMobile(mobileNo: string) {
    const path = `product/getCustomerDetails/${mobileNo}`;
    return createDigestGetRequest(path);
}

export function validateMobile(mobileNumber: string, dealerCategory: string) {
    const path = `user/checkRetailerMobile/${mobileNumber}/${dealerCategory}`;
    return createDigestGetRequest(path);
}

export function validateRetailerCoupon(couponData: any) {
    const path = 'coupon/validateRetailerCoupon';
    return createDigestPostRequest(path, couponData);
}

export function sendCustomerData(cdr: any) {
    const path = 'product/registerCustomer';
    return createDigestPostRequest(path, cdr);
}

export function getStatesFromCrmApi() {
    const path = 'state/crmState';
    return createDigestGetRequest(path);
}

export function getDistrictsFromCrmApi(stateId: string) {
    const path = `district/crmDistricts/${stateId}`;
    return createDigestGetRequest(path);
}

export function getDailyWinner(date: string) {
    const path = 'user/dailyWinners';
    const data = {
        date: date,
    };
    return createDigestPostRequest(path, data);
}

export function getDailyWinnerDates() {
    const path = 'user/getDailyWinnerDates/';
    return createDigestGetRequest(path);
}

export function getAirCoolerPointsSummary() {
    const path = 'user/getAirCoolerPointsSummary';
    return createDigestGetRequest(path);
}

export function getAirCoolerSchemeDetails() {
    const path = 'user/getAirCoolerSchemeDetails';
    return createDigestGetRequest(path);
}

export function senAirCoolerData(cdr: any) {
    const path = 'product/registerAirCoolerCustomer';
    return createDigestPostRequest(path, cdr);
}

export function getAirCoolerScanCodeHistory() {
    const path = 'coupon/airCoolerScanHistory';
    return createDigestGetRequest(path);
}

export function getCRMStateDistrictByPincode(pinCode: string) {
    const path = `state/getCRMStateDistrictByPinCode/${pinCode}`;
    return createDigestGetRequest(path);
}

export function getCRMPinCodeList(pinCode: string) {
    const path = `state/getCRMPinCodeList/${pinCode}`;
    return createDigestGetRequest(path);
}

export function checkScanPopUp(id: string) {
    const path = `user/scanPopUp/${id}`;
    return createDigestGetRequest(path);
}

export function getAy() {
    const path = 'user/getAccessmentYear';
    return createDigestGetRequest(path);
}

export function getTdsList(accementYear: string) {
    const path = `user/tdsCertificate/${accementYear}`;

    return createDigestGetRequest(path);
}

export function getFiscalYear() {
    const path = "user/getFiscalYear";
    return createGetRequest(path);
}

export function getMonth() {
    const path = "user/getMonth";
    return createGetRequest(path);
}

export function getTdsStatementList(month: any) {
    const path = 'user/getTdsStatementList';
    return createDigestPostRequest(path, month);
}

export function LoginWithSP(login: any) {
    const path = 'user/loginWithSp';
    return createDigestPostRequest(path, login);
}

export function addLogin(user: any) {
    const path = 'user/addLogin';
    return createDigestPostRequest(path, user);
}

export function getSubLoginList() {
    const path = 'user/getSubLoginList';
    return createDigestGetRequest(path);
}

export function checkVPA() {
    const path = 'order/checkVPA';
    return createDigestGetRequest(path);
}

export function verifyVPA() {
    const path = 'order/verifyVPA';
    return createDigestGetRequest(path);
}

export function sendScanInCoupon(couponData: any) {
    const path = 'coupon/scanIn';
    return createDigestPostRequest(path, couponData);
}