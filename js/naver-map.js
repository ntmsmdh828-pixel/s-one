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
  function failure() {
    status.textContent = '지도를 불러오지 못했습니다. 네이버 지도에서 찾기 버튼을 이용해 주세요.';
    status.hidden = false;
  }
  window.navermap_authFailure = failure;
  window.soneInitNaverMap = function () {
    try {
      if (!window.naver || !naver.maps) { failure(); return; }
      status.remove();
      const position = new naver.maps.LatLng(lat, lng);
      const map = new naver.maps.Map(element, { center: position, zoom: Number(cfg.zoom) || 16, scrollWheel: false });
      const marker = new naver.maps.Marker({ position: position, map: map, title: cfg.name || '서원씨앤씨' });
      const info = new naver.maps.InfoWindow({ content: '<div style="padding:12px 16px;font-size:14px;font-weight:700;color:#1c3154;">(주)서원씨앤씨</div>' });
      naver.maps.Event.addListener(marker, 'click', function () { info.open(map, marker); });
    } catch (e) { failure(); }
  };
  const script = document.createElement('script');
  script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + encodeURIComponent(clientId) + '&callback=soneInitNaverMap';
  script.async = true;
  script.onerror = failure;
  document.head.appendChild(script);
})();
