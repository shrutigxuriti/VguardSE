interface ShippingAddress {
    msg: string;
    currentHomeFlatBlockNo: string;
    currentStreetColonyLocality: string;
    currentLandMark: string;
    currentStateId: string;
    currentState: string;
    currentDist: string;
    curretnDistId: string;
    currentCity: string;
    currentCityId: string;
    currentPinCode: string;
    currentContactNo: string;
    emailId: string;
  }
  
  interface BankDetail {
    errorMessage: string;
    bankId: string;
    bankAccNo: string;
    bankAccHolderName: string;
    bankAccType: string;
    bankAccTypePos: string;
    bankNameAndBranch: string;
    branchAddress: string;
    bankIfsc: string;
    nomineeName: string;
    nomineeDob: string;
    checkPhoto: string;
    nomineeMobileNo: string;
    nomineeEmail: string;
    nomineeAdd: string;
    nomineeRelation: string;
    nomineeAccNo: string;
    bankDataPresent: number;
  }
  
  interface ProductDetail {
    specs: string;
    pointsFormat: string;
    product: string;
    productName: string;
    productCategory: string;
    productCode: string;
    points: number;
    imageUrl: string;
    userId: string;
    productId: string;
    paytmMobileNo: string;
  }
  
export  interface BankTransferDetails {
    userId: string;
    mobileNo: string;
    points: string;
    amount: string;
    shippingAddress: ShippingAddress;
    bankDetail: BankDetail;
    productDetail: ProductDetail;
    productId: string;
    roleId: string;
  }