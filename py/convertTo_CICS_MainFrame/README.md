# Tổng quan

Kho mã nguồn này chứa các tập lệnh Python dùng để chuyển đổi các tệp BMS và DSPF thành mã React và Java.

## Các tệp

* **bms2code.py:** Chuyển đổi các tệp BMS thành mã React và Java.
* **bms2react.py:** Chuyển đổi các tệp BMS chỉ thành mã React.
* **dspf2code.py:** Chuyển đổi các tệp DSPF thành mã React và Java.
* **dspf2react.py:** Chuyển đổi các tệp DSPF chỉ thành mã React.

# Hướng dẫn sử dụng

## Cách sử dụng chung

1. Mở cửa sổ Terminal.
2. Di chuyển đến thư mục chứa tập lệnh mà bạn muốn sử dụng.
3. Chạy tập lệnh bằng lệnh sau:

```bash
python <script_name>.py <arguments>
```

Thay thế `<script_name>` bằng tên thực tế của tập lệnh (ví dụ: `bms2react.py`) và cung cấp các tham số cần thiết.

## Các tập lệnh cụ thể

### bms2code.py

```bash
python bms2code.py -bms <path_to_BMS_folder> -react <path_to_React_folder> -spring <path_to_Spring_folder> -package <Spring_package>
```

* **path_to_BMS_folder:** Đường dẫn đến thư mục BMS. Chuyển đổi các tệp BMS thành mã React và Java.
* **path_to_React_folder:** Đường dẫn đến thư mục React. Dùng để lưu mã React được tạo.
* **path_to_Spring_folder:** Đường dẫn đến dự án Spring (ví dụ: `C:/spring-project`). Dùng để tạo mã Java cho Spring.
* **Spring_package:** Tên package của dự án Spring (ví dụ: `fa.training`). Dùng để tạo mã Java cho Spring.

### bms2react.py

```bash
python bms2react.py -bms <path_to_BMS_folder> -react <path_to_React_folder>
```

* **path_to_BMS_folder:** Đường dẫn đến thư mục BMS. Chuyển đổi các tệp BMS thành mã React.
* **path_to_React_folder:** Đường dẫn đến thư mục React. Dùng để lưu mã React được tạo.

### dspf2code.py

```bash
python dspf2code.py -dspf <path_to_DSPF_folder> -react <path_to_React_folder> -spring <path_to_Spring_folder> -package <Spring_package>
```

* **path_to_DSPF_folder:** Đường dẫn đến thư mục DSPF. Chuyển đổi các tệp DSPF thành mã React và Java.
* **path_to_React_folder:** Đường dẫn đến thư mục React. Dùng để lưu mã React được tạo.
* **path_to_Spring_folder:** Đường dẫn đến dự án Spring (ví dụ: `C:/spring-project`). Dùng để tạo mã Java cho Spring.
* **Spring_package:** Tên package của dự án Spring (ví dụ: `fa.training`). Dùng để tạo mã Java cho Spring.

### dspf2react.py

```bash
python dspf2react.py -bms <path_to_DSPF_folder> -react <path_to_React_folder>
```

* **path_to_DSPF_folder:** Đường dẫn đến thư mục DSPF. Chuyển đổi các tệp DSPF thành mã React.
* **path_to_React_folder:** Đường dẫn đến thư mục React. Dùng để lưu mã React được tạo.

---

##### Lưu ý:

```
**Hoàn nguyên (revert) về commit 4312e911 "generate function comment for python converter file" để chuyển đổi React mà không gọi API ở phía frontend.**
```

* Để đầu ra chính xác, hãy thay thế:

```python
if "name" in item and item["name"] and "type" in item and item["type"] in {'O', 'B'}
```

bằng:

```python
if "name" in item and item["name"] and "type" in item and item["type"] in {'I', 'B'}
```
