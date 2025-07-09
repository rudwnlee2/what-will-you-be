package com.example.whatwillyoube.whatwillyoube_backend.config;

import com.example.whatwillyoube.whatwillyoube_backend.interceptor.LoginCheckInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final LoginCheckInterceptor loginCheckInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // (1) loginCheckInterceptor 라는 경비원을 고용합니다.
        registry.addInterceptor(loginCheckInterceptor)
                // (2) '/api/members/myPage' 라는 문(URL)을 지키도록 임무를 줍니다.
                .addPathPatterns("/api/members/myPage");
    }
}
