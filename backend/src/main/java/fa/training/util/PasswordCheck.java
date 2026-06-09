package fa.training.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * PasswordCheck class provides utility methods for password strength checking
 * and email validation.
 * 
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
public class PasswordCheck {
    /**
     * Checks if the provided password meets the criteria for a strong password.
     * The regular expression pattern for a strong password.
     * It requires the password to have at least 8 characters,
     * including at least one uppercase letter, one lowercase letter, one digit,
     * and one special character (@#$%^&+=).
     * 
     * @param password The password to be checked.
     * @return true if the password is strong, false otherwise.
     */
    public static boolean isStrongPassword(String password) {
        String pattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";
        return password.matches(pattern);
    }

    /**
     * Validates the provided email address using a regular expression pattern.
     * 
     * @param email The email address to be validated.
     * @return true if the email address is valid, false otherwise.
     */
    public static boolean isEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pat = Pattern.compile(emailRegex);
        if (email == null)
            return false;
        Matcher matcher = pat.matcher(email);
        return matcher.matches() && email.equals(matcher.group());
    }
}
