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
