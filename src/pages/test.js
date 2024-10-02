import React, { useEffect, useState } from 'react';
import { fetchForeCast, fetchForeCast2 } from './forecast';

function App() {
    const [forecast, setForecast] = useState(null);
    const [forecast2, setForecast2] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchForeCast(60, 127).then(data => {
                console.log('Forecast data:', data); // 데이터 로깅
                setForecast(data);
            }),
            fetchForeCast2(60, 127).then(data => {
                console.log('Forecast2 data:', data); // 데이터 로깅
                setForecast2(data);
            })
        ])
        .then(() => setLoading(false))
        .catch(error => {
            console.error("데이터를 가져오는 중 오류 발생:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!forecast || !forecast2) {
        return <div>데이터를 가져올 수 없습니다.</div>;
    }

    return (
        <div>
            <h1>날씨 정보</h1>
            <p>기온: {forecast.temperature}℃</p>
            <p>강수: {forecast.rain}
            <br/>없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
            </p>
            <p>습도: {forecast.humidity}%</p>
            <p>하늘 상태: {forecast.cloudy}
            <br/>맑음(1), 구름많음(3), 흐림(4)</p>
            <p>최고 온도: {forecast2.maxTemp}</p>
            <p>최저 온도: {forecast2.minTemp}</p>
        </div>
    );
}

export default App;
