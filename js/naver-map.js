(function () {
  'use strict';
  const element = document.getElementById('soneNaverMap');
  const status = document.getElementById('soneMapStatus');
  const cfg = window.SONE_NAVER_MAP_CONFIG || {};
  if (!element || !status) return;
  const clientId = typeof cfg.clientId === 'string' ? cfg.clientId.trim() : '';
  const lat = Number(cfg.latitude), lng = Number(cfg.longitude);
  const validCoords = cfg.latitude !== null && cfg.longitude !== null &&
    Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  if (!clientId || !validCoords) {
    status.textContent = '지도 연결 준비 중입니다. 네이버 클라우드 Maps API 설정 후 지도가 표시됩니다. 위의 네이버 지도에서 찾기 버튼을 이용해 주세요.';
    return;
  }
  let initialized = false;
  function failure(reason, error) {
    console.error('[S-ONE NAVER Map]', reason, error || '');
    status.textContent = '지도를 불러오지 못했습니다 (' + reason + '). 네이버 지도에서 찾기 버튼을 이용해 주세요.';
    status.hidden = false;
  }
  window.navermap_authFailure = function () { failure('API 인증 실패'); };
  window.soneInitNaverMap = function () {
    try {
      if (initialized) return;
      if (!window.naver || !window.naver.maps || !window.naver.maps.Map) { failure('지도 SDK 초기화 실패'); return; }
      const position = new naver.maps.LatLng(lat, lng);
      const map = new naver.maps.Map(element, { center: position, zoom: Number(cfg.zoom) || 16, scrollWheel: false });
      // Render the marker locally so content blockers cannot block the default PNG icon.
      const marker = new naver.maps.Marker({
        position: position,
        map: map,
        title: cfg.name || '서원씨앤씨',
        icon: {
          content: '<div style="background:#2458a6;color:#fff;border:2px solid #fff;border-radius:22px;padding:9px 14px;white-space:nowrap;font-weight:700;font-size:14px;box-shadow:0 3px 12px #152a4866;">📍 서원씨앤씨</div>',
          anchor: new naver.maps.Point(70, 40)
        }
      });
      const info = new naver.maps.InfoWindow({ content: '<div style="padding:12px 16px;font-size:14px;font-weight:700;color:#1c3154;">(주)서원씨앤씨</div>' });
      naver.maps.Event.addListener(marker, 'click', function () { info.open(map, marker); });
      initialized = true;
      status.remove();
    } catch (e) { failure('지도 생성 오류', e); }
  };
  const script = document.createElement('script');
  script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + encodeURIComponent(clientId);
  script.async = true;
  script.onload = function () { window.soneInitNaverMap(); };
  script.onerror = function (error) { failure('지도 SDK 다운로드 실패', error); };
  document.head.appendChild(script);
})();
