**Đề bài: lấy dữ liệu từ File Excel đưa vào Map**
Yêu cầu:
1.	Sử dụng file data.xlsx, sau đó hiển thị 5000 cửa hàng lên bản đồ 
2.	Cập nhật thông tin cửa hàng

**Giải pháp**
1. Cho phép người dùng đính kèm File Excel từ bên ngoài.
2. Sau khi đính kèm File, dữ liệu được lưu xuống data local (sử dụng Watermelon Db)
3. Sử dụng data đã lưu hiển thị lên bản đồ. (Sử dụng MapView => có thể sử dụng Google Maps API) 
5. Hiển thị thông tin khi người dùng Click vào các điểm trên bản đồ.
6. Cho phép người dùng cập nhật thông tin gồm: tên CH, địa điểm.(data được update xuống db)
7. Người dùng có thể tìm kiếm tên CH trên thanh Search.
8. Người dùng có thể xem được vị trí hiện tại



Config Momo Payment: Link npm: 
https://www.npmjs.com/package/react-native-momosdk Link Github: https://github.com/momo-wallet/mobile-sdk/tree/master Link Github momo-wallet: https://github.com/momo-wallet/mobile-sdk/blob/master/ios/README.md
Link dowload Momo UAT and testing: https:
//developers.momo.vn/v2/#/docs/testing_information https://developers.momo.vn/v3/vi/docs/payment/onboarding/test-instructions/


Config Zalo Payment:
Link doc zalo: 
https://docs.zalopay.vn/v1/docs/apptoapp/api.html#doi-voi-react-native_tich-hop-va-khoi-tao-zpdk
Demo connect to Zalo: 
https://github.com/phithu/rn-zalo



GraphQL:
GraphQL là một ngôn ngữ truy vấn cho API và là một runtime để thực hiện các truy vấn đó bằng dữ liệu hiện có. 
Khi sử dụng trong React Native, GraphQL cung cấp một cách mạnh mẽ và linh hoạt để tương tác với dữ liệu, giúp tối ưu hóa và đơn giản hóa việc lấy dữ liệu từ server. Dưới đây là mô tả chi tiết về cách sử dụng GraphQL trong ứng dụng React Native.  Mutation trong GraphQL
Mutation là một loại yêu cầu trong GraphQL được sử dụng để thay đổi dữ liệu trên server, chẳng hạn như tạo mới, cập nhật hoặc xóa dữ liệu. Trong GraphQL, mutation tương tự như các phương thức POST, PUT, DELETE trong REST API.
 Endpoint trong GraphQL là URL mà client sẽ gửi các truy vấn (query) và mutation tới. Khác với REST API có nhiều endpoint cho các hành động khác nhau, GraphQL chỉ có một endpoint duy nhất cho tất cả các truy vấn và mutation.
 Mutation: Sử dụng để thay đổi dữ liệu trên server (tạo, cập nhật, xóa).
Endpoint: URL duy nhất cho tất cả các truy vấn và mutation trong GraphQL.
refetch: Dùng để làm mới dữ liệu sau khi thực hiện mutation.
  
