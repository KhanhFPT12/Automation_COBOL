package fa.training.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import fa.training.dto.request.UserLoginDTO;
import fa.training.exception.TokenException;
import fa.training.model.User;
import fa.training.security.Userprincipal;
import fa.training.security.jwt.JwtProvider;
import fa.training.service.AuthenticationService;
import fa.training.service.token.RefreshTokenSerice;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private RefreshTokenSerice refreshTokenSerice;


    @Override
    public User signIn(UserLoginDTO user) throws TokenException {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            Userprincipal userPrincipal = (Userprincipal) authentication.getPrincipal();
            String jwt = jwtProvider.generateToken(userPrincipal);
            User signedInUser = userPrincipal.getUser();
            signedInUser.setRfToken(refreshTokenSerice.createRefreshToken(signedInUser.getId()));
            signedInUser.setToken(jwt);
            return signedInUser;
        } catch (Exception ex) {
            throw new TokenException(ex.getMessage());
        }
    }

}
