// forecast.js
const DATA_API_KEY = "m8O0QaTVwAzleVprK21I2DbmjGFRkESZ4rc92WP%2BKAFaUBVIulitnqHyJKSp53eGq9plQdyGFypxFkBH3Maq2g%3D%3D";
const API_STEM = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

function xyUrl(x, y) {
    let std_time = new Date();
    std_time.setMinutes(std_time.getMinutes() - 30);

    let today = getFormatDate(std_time);
    let time = getFormatTime(std_time);
    return `${API_STEM}?serviceKey=${DATA_API_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${today}&base_time=${time}&nx=${x}&ny=${y}`;
}

function fetchForeCast(x, y) {
    return fetch(xyUrl(x, y))
        .then(response => {
            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(responseJSON => {
            if (!responseJSON.response.body.items.item) {
                throw new Error("예상치 못한 응답 형식");
            }

            const items = responseJSON.response.body.items.item;
            return {
                cloudy: items.filter(object => object['category'] === 'SKY')[0]?.fcstValue || '데이터 없음',
                humidity: items.filter(object => object['category'] === 'REH')[0]?.fcstValue || '데이터 없음',
                temperature: items.filter(object => object['category'] === 'T1H')[0]?.fcstValue || '데이터 없음',
                rain: items.filter(object => object['category'] === 'PTY')[0]?.fcstValue || '데이터 없음',
            };
        })
        .catch(error => {
            console.error("Forecast fetch error:", error);
        });
}

function getFormatDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '' + month + '' + day;
}

function getFormatTime(date) {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    hour = hour >= 10 ? hour : '0' + hour;
    minutes = minutes >= 10 ? minutes : '0' + minutes;
    return hour + '' + minutes;
}

const API_Base = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

function xyUrl2(x, y) {
    let std_time = new Date();
    std_time.setMinutes(std_time.getMinutes() - 180); // 현재 시간에서 3시간 전으로 설정

    let today = getFormatDate(std_time);
    let currentHour = std_time.getHours(); 
    let availableTimes = [200, 500, 800, 1100, 1400, 1700, 2000, 2300]; 

    let time = availableTimes.reverse().find(t => t <= currentHour * 100);

    if (!time) {
        std_time.setDate(std_time.getDate() - 1); 
        today = getFormatDate(std_time);
        time = 2300; 
    }

    return `${API_Base}?serviceKey=${DATA_API_KEY}&dataType=JSON&numOfRows=1000&pageNo=1&base_date=${today}&base_time=${time.toString().padStart(4, '0')}&nx=${x}&ny=${y}`;
}

function fetchForeCast2(x, y) {
    return fetch(xyUrl2(x, y))
        .then(response => {
            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(responseJSON => {
            console.log('Raw Forecast2 Response:', responseJSON); // 추가된 로그
            if (!responseJSON.response.body.items.item) {
                throw new Error("예상치 못한 응답 형식");
            }

            const items = responseJSON.response.body.items.item;
            return {
                minTemp: items.filter(object => object['category'] === 'TMN')[0]?.fcstValue || '데이터 없음',
                maxTemp: items.filter(object => object['category'] === 'TMX')[0]?.fcstValue || '데이터 없음',
            };
        })
        .catch(error => {
            console.error("Forecast2 fetch error:", error);
        });
}

// 일반 export로 내보내기
export { fetchForeCast, fetchForeCast2 };
