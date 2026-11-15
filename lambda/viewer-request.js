// CloudFront Function (runtime cloudfront-js-2.0), viewer-request on
// distribution EPBD5YIHCM3QO. Deployed by hand as function "site-viewer-request".
//
// Runs before the cache, so it sees the real Host header (the origin-request
// Lambda in index.js does not: by then Host is the S3 bucket).
//
// 1. Bare domain -> www (301). Must happen here, not in the origin-request
//    Lambda: the cache key does not include Host, so a cached redirect there
//    would also be served to www and loop.
// 2. Extensionless paths without a trailing slash get one (301), e.g.
//    /about -> /about/. The origin-request Lambda then maps "/" to
//    "/index.html". Without this, /about is a missing S3 key and 404s.

var CANONICAL_HOST = 'www.austinatchley.xyz';

function qs(querystring) {
  var parts = [];
  for (var key in querystring) {
    var entry = querystring[key];
    if (entry.multiValue) {
      for (var i = 0; i < entry.multiValue.length; i++) {
        parts.push(key + '=' + entry.multiValue[i].value);
      }
    } else {
      parts.push(key + (entry.value === '' ? '' : '=' + entry.value));
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: location } },
  };
}

function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value : '';
  var uri = request.uri;

  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  var needsSlash = uri !== '/' && !uri.endsWith('/') && lastSegment.indexOf('.') === -1;

  if (host !== CANONICAL_HOST) {
    return redirect('https://' + CANONICAL_HOST + uri + (needsSlash ? '/' : '') + qs(request.querystring));
  }

  if (needsSlash) {
    return redirect(uri + '/' + qs(request.querystring));
  }

  return request;
}
