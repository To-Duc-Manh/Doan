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

-- Bảng Quyền hạn
CREATE TABLE tbl_quyen_han
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_tinh_nang VARCHAR
(255) NOT NULL,
  chuc_nang VARCHAR
(255) NOT NULL
);

-- Bảng Chi tiết quyền hạn của nhân viên
CREATE TABLE tbl_chi_tiet_quyen_han_nhan_vien
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nhan_vien_id BIGINT,
  quyen_han_id BIGINT,
  FOREIGN KEY
(nhan_vien_id) REFERENCES tbl_nhan_vien
(id),
  FOREIGN KEY
(quyen_han_id) REFERENCES tbl_quyen_han
(id)
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
(id) ON
DELETE CASCADE,
  FOREIGN KEY (nha_san_xuat_id)
REFERENCES tbl_nha_san_xuat
(id) ON
DELETE CASCADE
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
(id) ON
DELETE CASCADE,
  FOREIGN KEY (mau_sac_id)
REFERENCES tbl_mau_sac
(id) ON
DELETE CASCADE,
  FOREIGN KEY (dung_luong_id)
REFERENCES tbl_dung_luong
(id) ON
DELETE CASCADE
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
(id) ON
DELETE CASCADE,
  FOREIGN KEY (khach_hang_id)
REFERENCES tbl_khach_hang
(id) ON
DELETE CASCADE
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
(id) ON
DELETE CASCADE,
  FOREIGN KEY (chi_tiet_san_pham_id)
REFERENCES tbl_chi_tiet_san_pham
(id) ON
DELETE CASCADE
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
(id) ON
DELETE CASCADE,
  FOREIGN KEY (chi_tiet_don_mua_hang_id)
REFERENCES tbl_chi_tiet_don_mua_hang
(id) ON
DELETE CASCADE
);
-- Bảng Giỏ hàng
CREATE TABLE tbl_gio_hang
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  khach_hang_id BIGINT,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(khach_hang_id) REFERENCES tbl_khach_hang
(id) ON
DELETE CASCADE
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
(id) ON
DELETE CASCADE,
  FOREIGN KEY
(khach_hang_id)
REFERENCES tbl_khach_hang
(id) ON
DELETE CASCADE
);

-- Bảng Phiếu nhập kho
CREATE TABLE tbl_phieu_nhap_kho
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nhan_vien_tao_id BIGINT,
  nha_cung_cap_id BIGINT,
  tong_tien FLOAT,
  ghi_chu VARCHAR,
  trang_thai INT NOT NULL,
  ngay_tao DATETIME NOT NULL,
  ngay_cap_nhat DATETIME,
  FOREIGN KEY
(nhan_vien_tao_id) REFERENCES tbl_nhan_vien
(id) ON
DELETE CASCADE,
  FOREIGN KEY (nha_cung_cap_id)
REFERENCES tbl_nha_cung_cap
(id) ON
DELETE CASCADE
);

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
(id) ON
DELETE CASCADE,
  FOREIGN KEY (san_pham_chi_tiet_id)
REFERENCES tbl_chi_tiet_san_pham
(id) ON
DELETE CASCADE
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
(san_pham_id) REFERENCES tbl_san_pham
(id) ON
DELETE CASCADE
);

-- Bảng Thành phố



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
(thanh_pho_id) ON
DELETE CASCADE,
  FOREIGN KEY (huyen_id)
REFERENCES tbl_huyen
(huyen_id) ON
DELETE CASCADE,
  FOREIGN KEY (xa_id)
REFERENCES tbl_xa
(xa_id) ON
DELETE CASCADE
);

-- Bảng Khuyến mãi
CREATE TABLE tbl_khuyen_mai
(
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten_ma_khuyen_mai VARCHAR
(255) NOT NULL,
  gia_tri_khuyen_mai INT NOT NULL,
  loai_khuyen_mai INT NOT NULL,
  ngay_bat_dau DATETIME NOT NULL,
  ngay_ket_thuc DATETIME NOT NULL,
  ngay_tao DATETIME,
  ngay_cap_nhat DATETIME
);

-- Bảng Chi tiết khuyến mãi của sản phẩm
CREATE TABLE tbl_chi_tiet_khuyen_mai_san_pham
(
  khuyen_mai_id BIGINT NOT NULL,
  san_pham_id BIGINT NOT NULL,
  PRIMARY KEY AUTO_INCREMENT
(khuyen_mai_id) ON
DELETE CASCADE,
  FOREIGN KEY (san_pham_id)
REFERENCES tbl_san_pham
(id) ON
DELETE CASCADE
);


DELIMITER
//

CREATE PROCEDURE GetProductDetails()
BEGIN
  SELECT
    tbl_san_pham.ten_san_pham,
    tbl_danh_muc.ten_danh_muc,
    tbl_nha_san_xuat.ten_nha_san_xuat,
    tbl_mau_sac.ten_mau_sac,
    tbl_dung_luong.ten_dung_luong,
    max_ctsp.id AS chi_tiet_id, -- Thêm trường id của bảng chi tiết sản phẩm
    max_ctsp.gia_ban,
    max_ctsp.serial,
    max_ctsp.ngay_tao,
    max_ctsp.ngay_cap_nhat,
    max_ctsp.hinh_anh
  FROM
    tbl_san_pham
    JOIN
    tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id
    JOIN
    tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id
    JOIN (
      SELECT
      san_pham_id,
      MAX(id) AS max_id
    FROM
      tbl_chi_tiet_san_pham
    GROUP BY
        san_pham_id
    ) AS max_ids ON tbl_san_pham.id = max_ids.san_pham_id
    JOIN tbl_chi_tiet_san_pham max_ctsp ON max_ids.max_id = max_ctsp.id
    JOIN
    tbl_mau_sac ON max_ctsp.mau_sac_id = tbl_mau_sac.id
    JOIN
    tbl_dung_luong ON max_ctsp.dung_luong_id = tbl_dung_luong.id;
END
//

DELIMITER ;



DELIMITER //
CREATE PROCEDURE GetProductDetailsAndRelated(IN productDetailId INT)
BEGIN
  -- Lấy thông tin chi tiết sản phẩm cụ thể
  SELECT
    tbl_san_pham.id AS product_id,
    tbl_san_pham.ten_san_pham,
    tbl_danh_muc.ten_danh_muc,
    tbl_nha_san_xuat.ten_nha_san_xuat,
    tbl_mau_sac.ten_mau_sac,
    tbl_dung_luong.ten_dung_luong,
    tbl_chi_tiet_san_pham.id AS chi_tiet_id,
    tbl_chi_tiet_san_pham.gia_ban,
    tbl_chi_tiet_san_pham.serial,
    tbl_chi_tiet_san_pham.ngay_tao,
    tbl_chi_tiet_san_pham.ngay_cap_nhat,
    tbl_chi_tiet_san_pham.hinh_anh
  FROM
    tbl_chi_tiet_san_pham
    JOIN tbl_san_pham ON tbl_chi_tiet_san_pham.san_pham_id = tbl_san_pham.id
    JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id
    JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id
    JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id
    JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id
  WHERE
        tbl_chi_tiet_san_pham.id = productDetailId;

  -- Lấy danh sách chi tiết sản phẩm khác có cùng sản phẩm ID
  SELECT
    tbl_chi_tiet_san_pham.id AS related_chi_tiet_id,
    tbl_chi_tiet_san_pham.gia_ban,
    tbl_chi_tiet_san_pham.serial,
    tbl_mau_sac.ten_mau_sac,
    tbl_dung_luong.ten_dung_luong
  FROM
    tbl_chi_tiet_san_pham
    JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id
    JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id
  WHERE
        tbl_chi_tiet_san_pham.san_pham_id = (
            SELECT
    san_pham_id
  FROM
    tbl_chi_tiet_san_pham
  WHERE
                id = productDetailId
        );
END
//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetProduct_datHang(IN productDetailId INT)
BEGIN
  -- Lấy thông tin chi tiết sản phẩm cụ thể
  SELECT
    tbl_san_pham.id AS product_id,
    tbl_san_pham.ten_san_pham,
    tbl_danh_muc.ten_danh_muc,
    tbl_nha_san_xuat.ten_nha_san_xuat,
    tbl_mau_sac.ten_mau_sac,
    tbl_dung_luong.ten_dung_luong,
    tbl_chi_tiet_san_pham.id AS chi_tiet_id,
    tbl_chi_tiet_san_pham.gia_ban,
    tbl_chi_tiet_san_pham.hinh_anh,
    tbl_chi_tiet_san_pham.serial,
    tbl_chi_tiet_san_pham.ngay_tao,
    tbl_chi_tiet_san_pham.ngay_cap_nhat
  FROM
    tbl_chi_tiet_san_pham
    JOIN tbl_san_pham ON tbl_chi_tiet_san_pham.san_pham_id = tbl_san_pham.id
    JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id
    JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id
    JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id
    JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id
  WHERE
        tbl_chi_tiet_san_pham.id = productDetailId;
END
//
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetProducts_datHang`
(IN productDetailIds TEXT)
BEGIN
  -- Lấy thông tin chi tiết sản phẩm dựa trên danh sách id được truyền vào
  SELECT
    tbl_san_pham.id AS product_id,
    tbl_san_pham.ten_san_pham,
    tbl_danh_muc.ten_danh_muc,
    tbl_nha_san_xuat.ten_nha_san_xuat,
    tbl_mau_sac.ten_mau_sac,
    tbl_dung_luong.ten_dung_luong,
    tbl_chi_tiet_san_pham.id AS chi_tiet_id,
    tbl_chi_tiet_san_pham.gia_ban,
    tbl_chi_tiet_san_pham.hinh_anh,
    tbl_chi_tiet_san_pham.serial,
    tbl_chi_tiet_san_pham.ngay_tao,
    tbl_chi_tiet_san_pham.ngay_cap_nhat
  FROM
    tbl_chi_tiet_san_pham
    JOIN tbl_san_pham ON tbl_chi_tiet_san_pham.san_pham_id = tbl_san_pham.id
    JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id
    JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id
    JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id
    JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id
  WHERE
        FIND_IN_SET(tbl_chi_tiet_san_pham.id, productDetailIds);
  END$$
DELIMITER
;




DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetProducts2_datHang`
(IN gioHangIds TEXT)
BEGIN
  -- Lấy thông tin sản phẩm từ các sản phẩm trong giỏ hàng, bao gồm cả thông tin về nhà sản xuất
  SELECT
    tbl_san_pham.ten_san_pham,
    tbl_nha_san_xuat.ten_nha_san_xuat,
    tbl_chi_tiet_san_pham.hinh_anh,
    tbl_mau_sac.ten_mau_sac,
    tbl_dung_luong.ten_dung_luong,
    tbl_chi_tiet_san_pham.gia_ban,
    tbl_gio_hang.so_luong,
    tbl_chi_tiet_san_pham.id AS chi_tiet_id
  FROM
    tbl_gio_hang
    JOIN tbl_chi_tiet_san_pham ON tbl_gio_hang.chi_tiet_san_pham_id = tbl_chi_tiet_san_pham.id
    JOIN tbl_san_pham ON tbl_chi_tiet_san_pham.san_pham_id = tbl_san_pham.id
    JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id
    JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id
    JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id
  WHERE
        FIND_IN_SET(tbl_gio_hang.id, gioHangIds);
  END$$
DELIMITER
;


WITH RECURSIVE dates AS
  (
    SELECT DATE(NOW()) AS date
UNION ALL
  SELECT DATE(date - INTERVAL
1 DAY)
    FROM dates
    WHERE date > DATE
(NOW
()) - INTERVAL 6 DAY
)


//baocao có phân biệt sản phẩm
SELECT
  sp.id AS chi_tiet_san_pham_id,
  sp.ten_san_pham,
  cts.hinh_anh,
  ms.ten_mau_sac,
  dl.ten_dung_luong,
  daily_sales.date AS ngay_ban,
  COALESCE(daily_sales.so_luong_ban, 0) AS so_luong_ban
FROM
  tbl_san_pham AS sp
  JOIN
  tbl_chi_tiet_san_pham AS cts ON sp.id = cts.san_pham_id
  JOIN
  tbl_mau_sac AS ms ON cts.mau_sac_id = ms.id
  JOIN
  tbl_dung_luong AS dl ON cts.dung_luong_id = dl.id
  LEFT JOIN (
    SELECT
    chi_tiet_san_pham_id,
    DATE(dmh.ngay_tao) AS date,
    SUM(so_luong) AS so_luong_ban
  FROM
    tbl_chi_tiet_don_mua_hang
    JOIN
    tbl_don_mua_hang AS dmh ON tbl_chi_tiet_don_mua_hang.don_mua_hang_id = dmh.id
  WHERE 
        dmh.trang_thai IN (4, 6) AND DATE(dmh.ngay_tao) >= DATE(NOW()) - INTERVAL 6 DAY 
GROUP BY 
        chi_tiet_san_pham_id, DATE(dmh.ngay_tao)
) AS daily_sales ON cts.id = daily_sales.chi_tiet_san_pham_id
JOIN 
    dates ON DATE
(daily_sales.date) = dates.date
ORDER BY 
    cts.id, daily_sales.date DESC;




//báo cáo không phân biệt sản phẩm

WITH RECURSIVE dates AS
  (
    SELECT DATE(NOW()) AS date
UNION ALL
  SELECT DATE(date - INTERVAL
1 DAY)
    FROM dates
    WHERE date > DATE
(NOW
()) - INTERVAL 6 DAY
)

SELECT
  daily_sales.date AS ngay_ban,
  SUM(COALESCE(daily_sales.so_luong_ban, 0)) AS so_luong_ban
FROM
  (
        SELECT
    chi_tiet_san_pham_id,
    DATE(dmh.ngay_tao) AS date,
    SUM(so_luong) AS so_luong_ban
  FROM
    tbl_chi_tiet_don_mua_hang
    JOIN
    tbl_don_mua_hang AS dmh ON tbl_chi_tiet_don_mua_hang.don_mua_hang_id = dmh.id
  WHERE 
            dmh.trang_thai IN (4, 6) AND DATE(dmh.ngay_tao) >= DATE(NOW()) - INTERVAL 6 DAY
GROUP BY 
            chi_tiet_san_pham_id, DATE(dmh.ngay_tao)
) AS daily_sales
JOIN 
    dates ON DATE
(daily_sales.date) = dates.date
GROUP BY 
    daily_sales.date
ORDER BY 
    daily_sales.date DESC;
