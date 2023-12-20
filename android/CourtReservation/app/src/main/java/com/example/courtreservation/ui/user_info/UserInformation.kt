package com.example.courtreservation.ui.user_info

import android.content.Intent
import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.courtreservation.MainActivity
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentUserInfoBinding
import com.example.courtreservation.network.PostDataTask
import com.example.courtreservation.ui.login.LoginActivity
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class UserInformation : Fragment(){
    private var _binding: FragmentUserInfoBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!
    private var rgGender: RadioGroup? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?

    ): View {
        _binding = FragmentUserInfoBinding.inflate(inflater, container, false)
        fetchUserInfo()
        val root: View = binding.root
        val username = LoginActivity.Usersingleton.username
        val editTextName: EditText = binding.editTextName
        val txtHello: TextView = binding.textView2
        editTextName.setText(username)
        txtHello.text = "Hello $username"
        binding.button.setOnClickListener(){
            onBtnClick(view)
        }
        rgGender = binding.rgGender
        rgGender?.setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener { radioGroup, i ->
            if (i == R.id.rbMale) {
                Toast.makeText(this.context, "Male", Toast.LENGTH_SHORT).show()
            } else if (i == R.id.rbFemale) {
                Toast.makeText(this.context, "Female", Toast.LENGTH_SHORT).show()
            }
        })

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
    private fun onBtnClick(view: View?) {
//        val username = LoginActivity.Usersingleton.username.toString()
        val username = "userCurtis"
        val jsonBody = JSONObject().apply {
            put("username", username)
            put("gender", when (rgGender?.checkedRadioButtonId) {
                R.id.rbMale -> "Male"
                R.id.rbFemale -> "Female"
                else -> ""  // Or some default value
            })
            put("height", binding.editTextHeight.text.toString())
            put("age", binding.editTextAge.text.toString())
            // Add other fields as necessary
        }
        binding.textView2.text = "Hello ${binding.editTextName.text}"
        binding.ShowName.text = "Name: ${binding.editTextName.text}"
        binding.ShowAge.text = "Age: ${binding.editTextAge.text}"
        binding.ShowHeight.text = "Height: ${binding.editTextHeight.text}"
        binding.ShowGender.text = "Gender: ${jsonBody.getString("gender")}"

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/update_user_info"
        PostDataTask { responseBody, responseCode ->
            requireActivity().runOnUiThread {
                if (responseBody.isNullOrEmpty()) {
                    Toast.makeText(this.context, "No response from server", Toast.LENGTH_LONG)
                        .show()
                    return@runOnUiThread
                }

                when (responseCode) {
                    HttpURLConnection.HTTP_OK -> {
                        // Handle success
                        val intent = Intent(this.context, MainActivity::class.java)
                        startActivity(intent)
                        requireActivity().finish()
                    }

                    HttpURLConnection.HTTP_UNAUTHORIZED -> {
                        // Handle unauthorized
                        val message =
                            JSONObject(responseBody).optString("message", "Unauthorized")
                        Toast.makeText(this.context, message, Toast.LENGTH_LONG).show()
                    }

                    else -> {
                        // Handle other cases
                        Toast.makeText(
                            this.context,
                            "Unexpected error: $responseCode",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            }
        }.execute(url, jsonBody.toString())

        Toast.makeText(this.context, "Set User info", Toast.LENGTH_SHORT).show()
    }
    private fun fetchUserInfo() {
        val username = LoginActivity.Usersingleton.username.toString()
        FetchUserTask().execute("https://cloudnative.eastasia.cloudapp.azure.com/curtis/get_user_info?username=$username")
    }

    private inner class FetchUserTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg urls: String): String {
            val url = URL(urls[0])
            return with(url.openConnection() as HttpURLConnection) {
                requestMethod = "GET"
                inputStream.bufferedReader().use { it.readText() }
            }
        }
        override fun onPostExecute(result: String) {
            val jsonResponse = JSONObject(result)
            updateUI(jsonResponse)
        }
    }
    private fun updateUI(jsonResponse: JSONObject) {
        // Example of how to use the JSON data to update UI elements
        val userName = jsonResponse.optString("user_name", "")
//        val userEmail = jsonResponse.optString("email", "")
        val userAge = jsonResponse.optString("age", "")
        val userHeight = jsonResponse.optString("height", "")
        val userGender = jsonResponse.optString("gender", "")

        binding.editTextName.setText(userName)
        binding.editTextAge.setText(userAge)
        binding.editTextHeight.setText(userHeight)
        binding.ShowName.text = "Name: $userName"
        binding.ShowAge.text = "Age: $userAge"
        binding.ShowHeight.text = "Height: $userHeight"
        binding.ShowGender.text = "Gender: $userGender"

        // Update gender radio buttons based on the fetched gender
        when (userGender) {
            "Male" -> binding.rgGender.check(R.id.rbMale)
            "Female" -> binding.rgGender.check(R.id.rbFemale)
        }
    }
}