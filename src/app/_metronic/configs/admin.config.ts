export const AdminConfigs = {
    urls: {
        getListAccounts:'/account',
        getListProduts:'/v1/Product/admin/paging',   
        getProductById:'/v1/Product/by-id?id=',
        updateProduct:"/v1/Product",
        createProduct:"/v1/Product",


        getReviewPaging:"/v1/Product/get-reviews-paging?productId=",
        getImageByProductId:"/v1/ProductImage/by-productid?productId=",
    }
}