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
            src="/Main/img_main.png"
            style={styles.image}
            onClick={handleImageClick}
          />
        </div>
        <div style={styles.right}>
          현재 위치에 따른 날씨, 센서 수치 이상 로그 기록, 더 알아보기 창
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
    margin: 20,
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
    maxWidth: "70%", //스크롤 안 될 정도로만 맞춤
    height: "auto",
  },
  box: {
    width: "100px", // 네모 박스 너비
    height: "100px", // 네모 박스 높이
    border: "1px solid black",
  },
};

export default Figures;
