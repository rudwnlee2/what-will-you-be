package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import com.example.whatwillyoube.whatwillyoube_backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Member memberJoin(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword())); // 회원가입 시 암호화
        return memberRepository.save(member);
    }

    public String login(String loginId, String rawPassword) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        if (!passwordEncoder.matches(rawPassword, member.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }

        return jwtUtil.generateToken(member.getId());
    }

}
