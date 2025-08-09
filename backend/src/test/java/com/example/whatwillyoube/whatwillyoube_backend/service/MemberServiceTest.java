package com.example.whatwillyoube.whatwillyoube_backend.service;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Gender;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@DisplayName("MemberService 테스트")
class MemberServiceTest {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MemberRequestDto validMemberDto;

    @BeforeEach
    void setUp() {
        memberRepository.deleteAll();
        validMemberDto = createMemberRequestDto("testuser", "password123!", "테스트유저", "test@example.com");
    }

    private MemberRequestDto createMemberRequestDto(String loginId, String password, String name, String email) {
        return MemberRequestDto.builder()
                .loginId(loginId)
                .password(password)
                .name(name)
                .email(email)
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.MALE)
                .phone("010-1234-5678")
                .school("테스트고등학교")
                .build();
    }

    @Test
    @DisplayName("회원가입 성공")
    void signUp_Success() {
        // when
        MemberResponseDto result = memberService.signUp(validMemberDto);

        // then
        assertNotNull(result);
        assertEquals("testuser", result.getLoginId());
        assertEquals("테스트유저", result.getName());
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    @DisplayName("중복 아이디로 회원가입 실패")
    void signUp_DuplicateLoginId() {
        // given
        memberService.signUp(validMemberDto);

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.signUp(validMemberDto));
        assertEquals("이미 사용 중인 아이디입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("중복 이메일로 회원가입 실패")
    void signUp_DuplicateEmail() {
        // given
        memberService.signUp(validMemberDto);
        MemberRequestDto duplicateEmailDto = MemberRequestDto.builder()
                .loginId("different")
                .password("password123!")
                .name("다른유저")
                .email("test@example.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.FEMALE)
                .phone("010-9876-5432")
                .school("다른고등학교")
                .build();

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.signUp(duplicateEmailDto));
        assertEquals("이미 사용 중인 이메일입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("로그인 성공")
    void login_Success() {
        // given
        memberService.signUp(validMemberDto);

        // when
        String token = memberService.login("testuser", "password123!");

        // then
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    @DisplayName("존재하지 않는 아이디로 로그인 실패")
    void login_UserNotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.login("nonexistent", "password123!"));
        assertEquals("존재하지 않는 회원입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("잘못된 비밀번호로 로그인 실패")
    void login_WrongPassword() {
        // given
        memberService.signUp(validMemberDto);

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.login("testuser", "wrongpassword!"));
        assertEquals("비밀번호가 틀렸습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("회원 정보 조회 성공")
    void getMember_Success() {
        // given
        MemberResponseDto savedMember = memberService.signUp(validMemberDto);
        Member member = memberRepository.findByLoginId("testuser").orElseThrow();

        // when
        MemberResponseDto result = memberService.getMember(member.getId());

        // then
        assertNotNull(result);
        assertEquals("testuser", result.getLoginId());
    }

    @Test
    @DisplayName("존재하지 않는 회원 조회 실패")
    void getMember_NotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.getMember(999L));
        assertEquals("존재하지 않는 회원입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("회원 정보 수정 성공")
    void updateMember_Success() {
        // given
        memberService.signUp(validMemberDto);
        Member member = memberRepository.findByLoginId("testuser").orElseThrow();
        MemberRequestDto updateDto = MemberRequestDto.builder()
                .loginId("testuser")
                .password("newpassword123!")
                .name("수정된이름")
                .email("updated@example.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.MALE)
                .phone("010-9999-9999")
                .school("수정된학교")
                .build();

        // when
        MemberResponseDto result = memberService.updateMember(member.getId(), updateDto);

        // then
        assertEquals("수정된이름", result.getName());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("010-9999-9999", result.getPhone());
    }

    @Test
    @DisplayName("존재하지 않는 회원 수정 실패")
    void updateMember_NotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.updateMember(999L, validMemberDto));
        assertTrue(exception.getMessage().contains("존재하지 않는 회원입니다."));
    }

    @Test
    @DisplayName("회원 탈퇴 성공")
    void deleteMember_Success() {
        // given
        memberService.signUp(validMemberDto);
        Member member = memberRepository.findByLoginId("testuser").orElseThrow();

        // when
        assertDoesNotThrow(() -> memberService.deleteMember(member.getId()));

        // then
        assertFalse(memberRepository.existsById(member.getId()));
    }

    @Test
    @DisplayName("존재하지 않는 회원 탈퇴 실패")
    void deleteMember_NotFound() {
        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> memberService.deleteMember(999L));
        assertTrue(exception.getMessage().contains("존재하지 않는 회원입니다."));
    }

    @Test
    @DisplayName("로그인 아이디 존재 확인 - 존재하는 경우")
    void isLoginIdExists_True() {
        // given
        memberService.signUp(validMemberDto);

        // when
        boolean exists = memberService.isLoginIdExists("testuser");

        // then
        assertTrue(exists);
    }

    @Test
    @DisplayName("로그인 아이디 존재 확인 - 존재하지 않는 경우")
    void isLoginIdExists_False() {
        // when
        boolean exists = memberService.isLoginIdExists("nonexistent");

        // then
        assertFalse(exists);
    }
}