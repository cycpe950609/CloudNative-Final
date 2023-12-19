package com.example.courtreservation.ui.forgot_password

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.courtreservation.databinding.ActivityForgotPasswordBinding
import com.example.courtreservation.network.PostDataTask
import org.json.JSONObject
import java.net.HttpURLConnection

class ForgotPasswordActivity : AppCompatActivity() {

    private lateinit var binding: ActivityForgotPasswordBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityForgotPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        binding.buttonSendCode.setOnClickListener {
            send_code()
        }

        binding.buttonChangePassword.setOnClickListener {
            change_password()
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    private fun send_code() {
        val email = binding.editTextForgotPasswordEmail.text.toString()
        var user_type = "User"

        val jsonBody = JSONObject()
        jsonBody.put("email", email)
        jsonBody.put("user_type", user_type)

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/login/send_reset_code"

        PostDataTask { responseBody, responseCode ->
            runOnUiThread {
                if (responseBody.isNullOrEmpty()) {
                    Toast.makeText(this, "No response from server", Toast.LENGTH_LONG).show()
                    return@runOnUiThread
                }

                when (responseCode) {
                    HttpURLConnection.HTTP_OK -> {
                        // Handle success
                        val message = JSONObject(responseBody).optString("message", "OK")
                        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
                    }
                    HttpURLConnection.HTTP_NOT_FOUND-> {
                        // Handle not found
                        val message = JSONObject(responseBody).optString("message", "Not Found")
                        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
                    }
                    else -> {
                        // Handle other cases
                        Toast.makeText(this, "Unexpected error: $responseCode", Toast.LENGTH_LONG).show()
                    }
                }
            }
        }.execute(url, jsonBody.toString())
    }

    private fun change_password() {
        val email = binding.editTextForgotPasswordEmail.text.toString()
        var verificationCode = binding.editTextForgotPasswordCode.text.toString()
        val newPassword = binding.editTextForgotPasswordNewPassword.text.toString()
        val repeatNewPassword = binding.editTextForgotPasswordConfirmPassword.text.toString()
        var user_type = "User"

        if (newPassword != repeatNewPassword) {
            Toast.makeText(this, "Password does not match", Toast.LENGTH_LONG).show()
            return
        }

        if (!validatePassword(newPassword)) {
            Toast.makeText(this, "Password must be at least 7 characters long and contains lowercase letter, number", Toast.LENGTH_LONG).show()
            return
        }

        val jsonBody = JSONObject()
        jsonBody.put("email", email)
        jsonBody.put("reset_code", verificationCode)
        jsonBody.put("new_password", newPassword)
        jsonBody.put("user_type", user_type)

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/login/reset_password"

        PostDataTask { responseBody, responseCode ->
            runOnUiThread {
                if (responseBody.isNullOrEmpty()) {
                    Toast.makeText(this, "No response from server", Toast.LENGTH_LONG).show()
                    return@runOnUiThread
                }

                when (responseCode) {
                    HttpURLConnection.HTTP_OK -> {
                        // Handle success
                        val message = JSONObject(responseBody).optString("message", "OK")
                        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
                    }
                    HttpURLConnection.HTTP_BAD_REQUEST-> {
                        // Handle bad request
                        val message = JSONObject(responseBody).optString("message", "Bad request")
                        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
                    }
                    else -> {
                        // Handle other cases
                        Toast.makeText(this, "Unexpected error: $responseCode", Toast.LENGTH_LONG).show()
                    }
                }
            }
        }.execute(url, jsonBody.toString())
    }

    private fun validatePassword(password: String): Boolean {
        val passwordRegex = "^(?=.*[a-z])(?=.*\\d)[a-z\\d]{7,}$".toRegex()
        return passwordRegex.matches(password)
    }
}
