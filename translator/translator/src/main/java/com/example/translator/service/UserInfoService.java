package com.example.translator.service;

import com.example.translator.entity.UserInfo;
import com.example.translator.entity.request.EditUserRequest;
import com.example.translator.entity.request.UserRequest;
import com.example.translator.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<UserInfo> userDetail = userRepository.findByUsername(username);

        // Converting userDetail to UserDetails
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found " + username));
    }

    public UserInfo findUsername(String username){
        return userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User Not Found"));
    }

    public UserInfo findUserById(Long user_id){
        return userRepository.findById(user_id).orElseThrow(() -> new EntityNotFoundException("User Not Found"));
    }

    public boolean isInputNull(UserRequest request){
        return request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getFirstname() == null || request.getFirstname().isEmpty() ||
                request.getLastname() == null || request.getLastname().isEmpty() ||
                request.getEmail() == null || request.getEmail().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty();
    }

    public UserInfo addUser(UserRequest request){
        UserInfo user = UserInfo.builder()
                .username(request.getUsername())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .roles("ROLE_USER")
                .build();
        return userRepository.save(user);
    }

    public UserInfo addUser2(UserRequest request){
        UserInfo user = UserInfo.builder()
                .username(request.getUsername())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .roles("ROLE_ADMIN")
                .build();
        return userRepository.save(user);
    }

    public UserInfo editUser(Long user_id, EditUserRequest request){
        UserInfo user = findUserById(user_id);
        user.setUsername(request.getUsername());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }

}
