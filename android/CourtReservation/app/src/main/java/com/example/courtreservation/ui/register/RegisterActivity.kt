package com.example.courtreservation.ui.register

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.courtreservation.databinding.ActivityRegisterBinding
import com.example.courtreservation.network.PostDataTask
import org.json.JSONObject
import java.net.HttpURLConnection

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        binding.buttonRegister.setOnClickListener {
            register()
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    private fun register() {
        val username = binding.editTextRegisterUsername.text.toString()
        val password = binding.editTextRegisterPassword.text.toString()
        val repeatpassword = binding.editTextRegisterRepeatPassword.text.toString()
        val email = binding.editTextEmail.text.toString()
        val user_type = "User"

        if (username.isBlank()) {
            Toast.makeText(this, "Username is required", Toast.LENGTH_LONG).show()
            return
        }

        if (password.isBlank()) {
            Toast.makeText(this, "Password is required", Toast.LENGTH_LONG).show()
            return
        }

        if (password != repeatpassword) {
            Toast.makeText(this, "Password does not match", Toast.LENGTH_LONG).show()
            return
        }

        if (!validatePassword(password)) {
            Toast.makeText(this, "Password must be at least 7 characters long and contains lowercase letter, number", Toast.LENGTH_LONG).show()
            return
        }

        if (!validateEmail(email)) {
            Toast.makeText(this, "Invalid Email", Toast.LENGTH_LONG).show()
            return
        }

        val jsonBody = JSONObject()
        jsonBody.put("username", username)
        jsonBody.put("password", password)
        jsonBody.put("email", email)
        jsonBody.put("user_type", user_type)

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/login/register"

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

    private fun validateEmail(email: String): Boolean {
        val emailRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$".toRegex()
        return emailRegex.matches(email)
    }
}
