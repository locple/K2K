# Gõ tiếng Việt bằng phương pháp K2K (Key Combination II)

Tổ hợp phím có nghĩa là **nhấn đồng thời** 2 hay nhiều phím, để xuất ra mỗi lần một chữ cái tiếng Việt có đầy đủ dấu *(không gõ tuần tự từng phím như các phương pháp khác)*
- Mỗi chữ cái **Â,Ă,Ê,Ư,Ơ,Ô,Đ** được gõ bằng cách **dùng 2 ngón tay** để nhấn cùng lúc 2 phím kế nhau như hình dưới.
- Nhấn các cặp phím lân cận để gõ thêm dấu thanh sau mỗi nguyên âm. Có thể nhấn thêm lần nữa để đổi dấu / xóa dấu của nguyên âm đứng trước.

Phương pháp này cho phép gõ tiếng Việt và tiếng Anh (hay các thứ tiếng khác) trộn lẫn một cách tiện lợi mà không cần phải tắt chế độ gõ tiếng Việt.
# Hướng dẫn gõ trên bàn phím QWERTY:
<img src="k2k_keyboard_layout.jpg" width="800" height="400"/>

# Online Demo: [k2.ai.vn/k2k](https://k2.ai.vn/k2k)

# Minh họa cách nhúng VietK2K vào trang web:
Chương trình **vietk2k.js** dùng để tích hợp phương pháp gõ K2K vào các TextBox, TextArea trên trình duyệt web (đã test trên MS Edge).
```javascript
<script type="text/javascript" src="vietk2k.js"></script>
<script>
    var textArea = document.getElementById("userInput");
    var vKK = new VietK2K();
    vKK.attach(textArea);
    vKK.setMode(1);
</script>
```
Tham khảo file **example.html**
> [!CAUTION]
**Phải TẮT các kiểu gõ khác như TELEX, VNI** khi gõ bằng phương pháp K2K.

© 2024 **Lê Phước Lộc** *(phuocloc@gmail.com)*
