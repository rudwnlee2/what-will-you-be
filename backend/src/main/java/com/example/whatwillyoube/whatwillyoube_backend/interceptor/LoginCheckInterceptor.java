package com.example.whatwillyoube.whatwillyoube_backend.interceptor;

import com.example.whatwillyoube.whatwillyoube_backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class LoginCheckInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 변환을 위해

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorizationHeader = request.getHeader("Authorization");

        // 토큰이 없거나 형식이 잘못된 경우
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // (A) HTTP 상태 코드를 401(Unauthorized)로 설정
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            // (B) 응답 본문의 타입을 JSON으로 설정
            response.setContentType("application/json");
            // (C) 문자 인코딩을 UTF-8로 설정 (한글 깨짐 방지)
            response.setCharacterEncoding("UTF-8");

            // (D) 응답할 JSON 메시지 생성
            Map<String, String> errorDetails = new HashMap<>();
            errorDetails.put("message", "인증 토큰이 없거나 형식이 올바르지 않습니다.");
            errorDetails.put("status", "401");

            // (E) JSON을 문자열로 변환하여 응답 본문에 작성
            String jsonResponse = objectMapper.writeValueAsString(errorDetails);
            response.getWriter().write(jsonResponse);

            // (F) 컨트롤러로 진행하지 않고 요청 종료
            return false;
        }

        String token = authorizationHeader.substring(7);

        // 토큰이 유효하지 않은 경우
        if (!jwtUtil.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, String> errorDetails = new HashMap<>();
            errorDetails.put("message", "토큰이 유효하지 않습니다.");
            errorDetails.put("status", "401");

            String jsonResponse = objectMapper.writeValueAsString(errorDetails);
            response.getWriter().write(jsonResponse);

            return false;
        }

        Long memberId = jwtUtil.extractMemberId(token);
        request.setAttribute("memberId", memberId);

        return true;
    }
}