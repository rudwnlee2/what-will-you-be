package com.example.whatwillyoube.whatwillyoube_backend.controller;

import com.example.whatwillyoube.whatwillyoube_backend.domain.Gender;
import com.example.whatwillyoube.whatwillyoube_backend.domain.Member;
import com.example.whatwillyoube.whatwillyoube_backend.dto.LoginRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberRequestDto;
import com.example.whatwillyoube.whatwillyoube_backend.dto.MemberResponseDto;
import com.example.whatwillyoube.whatwillyoube_backend.security.UserDetailsImpl;
import com.example.whatwillyoube.whatwillyoube_backend.service.MemberService;
import com.example.whatwillyoube.whatwillyoube_backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = MemberController.class)
@AutoConfigureMockMvc(addFilters = false) // 시큐리티 필터 제외
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MemberService memberService; // Service 계층은 Mock 처리

    @Autowired
    private ObjectMapper objectMapper;

    private Member testMember;

    @BeforeEach
    void setup() {
        // 테스트용 Member 엔티티 생성
        testMember = Member.builder()
                .loginId("testId")
                .password("encodedPw")
                .name("테스터")
                .email("test@test.com")
                .birth(LocalDate.of(2000, 1, 1))
                .gender(Gender.MALE)
                .phone("010-1234-5678")
                .school("테스트학교")
                .build();

        // JPA가 자동으로 넣어주는 필드를 리플렉션으로 세팅
        ReflectionTestUtils.setField(testMember, "id", 1L);
        ReflectionTestUtils.setField(testMember, "createdDate", LocalDateTime.now());
    }

    @Test
    @DisplayName("회원가입 성공 시 201 반환")
    void signUp_success() throws Exception {
        // given: 요청 DTO와 Mock 응답 DTO 준비
        MemberRequestDto requestDto = new MemberRequestDto(
                "testId", "Password!1", "테스터", "test@test.com",
                LocalDate.of(2000, 1, 1), Gender.MALE,
                "010-1234-5678", "테스트학교"
        );
        MemberResponseDto responseDto = MemberResponseDto.from(testMember);
        given(memberService.signUp(any(MemberRequestDto.class))).willReturn(responseDto);

        // when & then: POST 요청 → 201 응답 + 응답 본문 검증
        mockMvc.perform(post("/api/members/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.loginId").value("testId"))
                .andExpect(jsonPath("$.email").value("test@test.com"));
    }

    @Test
    @DisplayName("로그인 성공 시 200 반환 + Authorization 헤더 추가")
    void login_success() throws Exception {
        // given
        LoginRequestDto requestDto = new LoginRequestDto("testId", "Password!1");
        String token = "Bearer test.jwt.token";
        given(memberService.login(anyString(), anyString())).willReturn(token);

        // when & then
        mockMvc.perform(post("/api/members/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(header().string(JwtUtil.AUTHORIZATION_HEADER, token));
    }

    @Test
    @DisplayName("내 정보 조회 성공 시 200 반환")
    void myPage_success() throws Exception {
        // given: 서비스 계층에서 응답할 DTO 세팅
        MemberResponseDto responseDto = MemberResponseDto.from(testMember);
        given(memberService.getMember(1L)).willReturn(responseDto);
        UserDetailsImpl principal = new UserDetailsImpl(testMember);

        // when & then: GET 요청 + 커스텀 유저 주입 → 200 응답
        mockMvc.perform(get("/api/members/me")
                        .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loginId").value("testId"));
    }

    @Test
    @DisplayName("내 정보 수정 성공 시 200 반환")
    void updateMyPage_success() throws Exception {
        // given
        MemberRequestDto updateRequest = new MemberRequestDto(
                "newId", "Password!1", "새이름", "new@test.com",
                LocalDate.of(2001, 2, 2), Gender.FEMALE,
                "010-1111-2222", "새학교"
        );

        Member updatedMember = Member.builder()
                .loginId("newId").password("encodedPw").name("새이름")
                .email("new@test.com").birth(LocalDate.of(2001, 2, 2))
                .gender(Gender.FEMALE).phone("010-1111-2222").school("새학교")
                .build();
        ReflectionTestUtils.setField(updatedMember, "id", 1L);

        MemberResponseDto responseDto = MemberResponseDto.from(updatedMember);
        given(memberService.updateMember(eq(1L), any(MemberRequestDto.class))).willReturn(responseDto);

        UserDetailsImpl principal = new UserDetailsImpl(testMember);

        // when & then
        mockMvc.perform(patch("/api/members/me")
                        .with(SecurityMockMvcRequestPostProcessors.user(principal))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loginId").value("newId"))
                .andExpect(jsonPath("$.email").value("new@test.com"));
    }

    @Test
    @DisplayName("회원 탈퇴 성공 시 204 반환")
    void deleteMember_success() throws Exception {
        // given
        UserDetailsImpl principal = new UserDetailsImpl(testMember);

        // when & then: DELETE 요청 → 204 응답 + 서비스 호출 검증
        mockMvc.perform(delete("/api/members/me")
                        .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                .andExpect(status().isNoContent());

        verify(memberService).deleteMember(1L);
    }
}