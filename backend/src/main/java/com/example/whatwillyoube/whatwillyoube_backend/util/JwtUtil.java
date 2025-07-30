package com.example.whatwillyoube.whatwillyoube_backend.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    public static final String AUTHORIZATION_HEADER = "Authorization";

    // 비밀키 (실무에선 환경변수나 yml로 관리)
    private final String secretKey = "mySuperSecretKey1234567890!@#$%^";
    private final long expiration = 1000 * 60 * 30; // 30분

    //토큰 생성: id를 subject에 담는다
    public String generateToken(Long memberId) {
        return Jwts.builder()
                .setSubject(memberId.toString()) // id를 문자열로 넣음
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    //토큰에서 memberId 추출
    public Long extractMemberId(String token) {
        return Long.parseLong(
                Jwts.parserBuilder()
                        .setSigningKey(secretKey.getBytes())
                        .build()
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject()
        );
    }

    //토큰 유효성 검사 (서명, 만료 확인)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey.getBytes())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
