package com.example.courtreservation.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.courtreservation.MainActivity
import com.example.courtreservation.databinding.ActivityLoginBinding
import com.example.courtreservation.ui.forgot_password.ForgotPasswordActivity
import com.example.courtreservation.ui.register.RegisterActivity
import com.example.courtreservation.network.PostDataTask
import org.json.JSONObject
import java.net.HttpURLConnection

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    object Usersingleton{
        var username: String = ""
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLoginBinding.inflate(layoutInflater)
        supportActionBar?.hide()
        setContentView(binding.root)

        binding.textViewForgotPassword.setOnClickListener {
            val intent = Intent(this, ForgotPasswordActivity::class.java)
            startActivity(intent)
        }

        binding.buttonLogin.setOnClickListener {
            login()
        }

        binding.textViewRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }

    private fun login() {
        val username = binding.editTextUsername.text.toString()
        val password = binding.editTextPassword.text.toString()
        val user_type = "User"

        // Check if username or password is empty
        if (username.isBlank()) {
            Toast.makeText(this, "Username is required", Toast.LENGTH_LONG).show()
            return
        }

        if (password.isBlank()) {
            Toast.makeText(this, "Password is required", Toast.LENGTH_LONG).show()
            return
        }

        val jsonBody = JSONObject()
        jsonBody.put("username", username)
        jsonBody.put("password", password)
        jsonBody.put("user_type", user_type)

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/login"

        PostDataTask { responseBody, responseCode ->
            runOnUiThread {
                if (responseBody.isNullOrEmpty()) {
                    Toast.makeText(this, "No response from server", Toast.LENGTH_LONG).show()
                    return@runOnUiThread
                }

                when (responseCode) {
                    HttpURLConnection.HTTP_OK -> {
                        // Handle success
                        Usersingleton.username = username
                        val intent = Intent(this, MainActivity::class.java)
                        startActivity(intent)
                        finish()
                    }
                    HttpURLConnection.HTTP_UNAUTHORIZED -> {
                        // Handle unauthorized
                        val message = JSONObject(responseBody).optString("message", "Unauthorized")
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

}
