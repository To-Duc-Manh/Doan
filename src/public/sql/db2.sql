CREATE TABLE tbl_thanh_pho
(
  thanh_pho_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_thanh_pho VARCHAR
(255) NOT NULL
);

-- Bảng Huyện
CREATE TABLE tbl_huyen
(
  huyen_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_huyen VARCHAR
(255) NOT NULL,
  thanh_pho_id BIGINT,
  FOREIGN KEY
(thanh_pho_id) REFERENCES tbl_thanh_pho
(thanh_pho_id) ON
DELETE CASCADE
);

-- Bảng Xã
CREATE TABLE tbl_xa
(
  xa_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_xa VARCHAR
(255) NOT NULL,
  huyen_id BIGINT,
  FOREIGN KEY
(huyen_id) REFERENCES tbl_huyen
(huyen_id) ON
DELETE CASCADE
);
-- Bảng Hãng sản xuất
CREATE TABLE tbl_nha_san_xuat
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_nha_san_xuat VARCHAR
(255) NOT NULL,
  email VARCHAR
(255),
  so_dien_thoai VARCHAR
(255),
  dia_chi VARCHAR
(255),
  hinh_anh VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME
);
-- Bảng Màu sắc
CREATE TABLE tbl_mau_sac
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_mau_sac VARCHAR
(255) NOT NULL
);

-- Bảng Dung lượng
CREATE TABLE tbl_dung_luong
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_dung_luong VARCHAR
(255) NOT NULL
);
-- Bảng Nhà cung cấp
CREATE TABLE tbl_nha_cung_cap
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_nha_cung_cap VARCHAR
(255) NOT NULL,
  email VARCHAR
(255),
  so_dien_thoai VARCHAR
(255),
  dia_chi VARCHAR
(255),
  hinh_anh VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME
);

-- Bảng Nhân viên
CREATE TABLE tbl_nhan_vien
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_nhan_vien VARCHAR
(255) NOT NULL,
  email VARCHAR
(255) NOT NULL,
  so_dien_thoai VARCHAR
(255),
  dia_chi VARCHAR
(255),
  mat_khau VARCHAR
(255) NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME
);

-- Bảng Khách hàng
CREATE TABLE tbl_khach_hang
(
  -- AUTO_INCREMENT
  id BIGINT PRIMARY KEY AUTO_INCREMENT ,
  ho_ten VARCHAR
(255) NOT NULL,
  email VARCHAR
(255) NOT NULL,
  mat_khau VARCHAR
(255) NOT NULL,
  ngay_sinh DATETIME,
  gioi_tinh VARCHAR
(10),
  so_dien_thoai VARCHAR
(10),
  dia_chi VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME
);


-- Bảng Danh mục
CREATE TABLE tbl_danh_muc
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_danh_muc VARCHAR
(255) NOT NULL,
  trang_thai INT NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME
);



-- Bảng Sản phẩm
CREATE TABLE tbl_san_pham
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  danh_muc_id BIGINT,
  hinh_anh VARCHAR
(255),
  nha_san_xuat_id BIGINT,
  ten_san_pham VARCHAR
(255) NOT NULL,
  so_thang_bao_hanh INT NOT NULL,
  mo_ta TEXT,
  trang_thai INT NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(danh_muc_id) REFERENCES tbl_danh_muc
(id) ON DELETE CASCADE,
  FOREIGN KEY (nha_san_xuat_id)
REFERENCES tbl_nha_san_xuat
(id) ON DELETE CASCADE
);
-- Bảng Chi tiết sản phẩm
CREATE TABLE tbl_chi_tiet_san_pham
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hinh_anh VARCHAR
(255),
  san_pham_id BIGINT,
  mau_sac_id BIGINT,
  dung_luong_id BIGINT,
  gia_ban BIGINT NOT NULL,
  serial VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(san_pham_id) REFERENCES tbl_san_pham
(id) ON DELETE CASCADE,
  FOREIGN KEY (mau_sac_id)
REFERENCES tbl_mau_sac
(id) ON DELETE CASCADE,
  FOREIGN KEY (dung_luong_id)
REFERENCES tbl_dung_luong
(id) ON DELETE CASCADE
);


-- Bảng Đơn mua hàng
CREATE TABLE tbl_don_mua_hang
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nhan_vien_id BIGINT,
  khach_hang_id BIGINT,
  ten_nguoi_mua VARCHAR
(255) NOT NULL,
  so_dien_thoai VARCHAR
(10) NOT NULL,
  dia_chi_mua_hang VARCHAR
(255) NOT NULL,
  ghi_chu VARCHAR
(255),
  tong_tien FLOAT NOT NULL,
  phi_van_chuyen FLOAT,
  tong_tien_thanh_toan FLOAT NOT NULL,
  hinh_thuc_thanh_toan INT NOT NULL,
  trang_thai INT NOT NULL,
  ngay_huy DATETIME,
  ly_do_huy VARCHAR
(255),
  hinh_anh_giao_hang VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(nhan_vien_id) REFERENCES tbl_nhan_vien
(id) ON DELETE CASCADE,
  FOREIGN KEY (khach_hang_id)
REFERENCES tbl_khach_hang
(id) ON DELETE CASCADE
);
-- Bảng Chi tiết đơn mua hàng
CREATE TABLE tbl_chi_tiet_don_mua_hang
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  don_mua_hang_id BIGINT,
  chi_tiet_san_pham_id BIGINT,
  so_luong INT NOT NULL,
  gia FLOAT NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(don_mua_hang_id) REFERENCES tbl_don_mua_hang
(id) ON DELETE CASCADE,
  FOREIGN KEY (chi_tiet_san_pham_id)
REFERENCES tbl_chi_tiet_san_pham
(id) ON DELETE CASCADE
);

-- Bảng Chi tiết giỏ hàng
CREATE TABLE tbl_gio_hang
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  khach_hang_id BIGINT,
  chi_tiet_san_pham_id BIGINT,
  so_luong INT NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(chi_tiet_san_pham_id)
REFERENCES tbl_chi_tiet_san_pham
(id) ON DELETE CASCADE,
  FOREIGN KEY
(khach_hang_id)
REFERENCES tbl_khach_hang
(id) ON DELETE CASCADE
);

CREATE TABLE tbl_phieu_nhap_kho (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nhan_vien_tao_id BIGINT,
  nha_cung_cap_id BIGINT,
  tong_tien FLOAT,
  ghi_chu VARCHAR(255),
  trang_thai INT NOT NULL,
  ngay_tao DATETIME NOT NULL,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY (nhan_vien_tao_id) REFERENCES tbl_nhan_vien (id) ON DELETE CASCADE,
  FOREIGN KEY (nha_cung_cap_id) REFERENCES tbl_nha_cung_cap (id) ON DELETE CASCADE
);
;


-- Bảng Chi tiết phiếu nhập kho
CREATE TABLE tbl_chi_tiet_phieu_nhap_kho
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  phieu_nhap_kho_id BIGINT,
  san_pham_chi_tiet_id BIGINT,
  so_luong INT NOT NULL,
  gia FLOAT NOT NULL,
  ghi_chu VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(phieu_nhap_kho_id) REFERENCES tbl_phieu_nhap_kho
(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_chi_tiet_id)
REFERENCES tbl_chi_tiet_san_pham
(id) ON DELETE CASCADE
);
-- Bảng Hình ảnh
CREATE TABLE tbl_hinh_anh
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  san_pham_id BIGINT,
  duong_dan VARCHAR
(255),
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(san_pham_id) REFERENCES tbl_san_pham(id) ON DELETE CASCADE
);

-- Bảng Phiếu bảo hành
CREATE TABLE tbl_phieu_bao_hanh
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chi_tiet_don_mua_hang_id BIGINT,
  serial VARCHAR
(255),
  nhan_vien_id BIGINT,
  tieu_de VARCHAR
(255),
  loai_bao_hanh BIGINT,
  ghi_chu VARCHAR
(255),
  chi_phi VARCHAR
(255),
  ngay_bat_dau DATETIME NOT NULL,
  ngay_ket_thuc DATETIME NOT NULL,
  ly_do_huy VARCHAR
(255),
  trang_thai INT NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(nhan_vien_id) REFERENCES tbl_nhan_vien
(id) ON DELETE CASCADE,
  FOREIGN KEY (chi_tiet_don_mua_hang_id)
REFERENCES tbl_chi_tiet_don_mua_hang
(id) ON DELETE CASCADE
);

-- Bảng Vận chuyển
CREATE TABLE tbl_van_chuyen
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  thanh_pho_id BIGINT,
  huyen_id BIGINT,
  xa_id BIGINT,
  phi_van_chuyen FLOAT NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(thanh_pho_id) REFERENCES tbl_thanh_pho
(thanh_pho_id) ON DELETE CASCADE,
  FOREIGN KEY (huyen_id)
REFERENCES tbl_huyen
(huyen_id) ON DELETE CASCADE,
  FOREIGN KEY (xa_id)
REFERENCES tbl_xa
(xa_id) ON DELETE CASCADE
);



