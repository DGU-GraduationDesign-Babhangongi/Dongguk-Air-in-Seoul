import React from "react";
import Header from "../components/common/Header/Header";
import { useNavigate } from "react-router-dom";

/*처음 들어가면 나오는 화면*/
function Figures() {
  const navigate = useNavigate(); // navigate 훅 사용

  const handleImageClick = () => {
    navigate("/floorcheck"); // 원하는 페이지로 이동
  };
  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.left}>신공학관</div>
        <div style={styles.middle}>
          <img
            src="../1층_3d.png"
            style={styles.image}
            onClick={handleImageClick}
          />
        </div>
        <div style={styles.right}>
          <div style={styles.box}>{/* 네모 박스의 내용 */}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px", // Header 아래 여백
    padding: "0 20px", // 좌우 여백
  },
  left: {
    flex: 1,
    textAlign: "left",
  },
  middle: {
    flex: 3,
    display: "flex",
    justifyContent: "center",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  box: {
    width: "100px", // 네모 박스 너비
    height: "100px", // 네모 박스 높이
    border: "1px solid black",
  },
};

export default Figures;
