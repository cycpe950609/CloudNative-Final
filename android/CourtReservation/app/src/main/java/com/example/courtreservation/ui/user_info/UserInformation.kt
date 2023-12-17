package com.example.courtreservation.ui.user_info

import android.content.Intent
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
        val username = LoginActivity.Usersingleton.username.toString()
        val jsonBody = JSONObject()
        jsonBody.put("username", username)
        val txtHello: TextView = binding.textView2
        val txtName: TextView = binding.ShowName
        val txtAge: TextView = binding.ShowAge
        val txtGender: TextView = binding.ShowGender
        val txtHeight: TextView = binding.ShowHeight
        val editTextName: EditText = binding.editTextName
        val editTextAge: EditText = binding.editTextAge
        val editTextHeight: EditText = binding.editTextHeight
        when (rgGender?.checkedRadioButtonId) {
            R.id.rbMale -> {
                txtGender.text = "Gender: Male"
                Toast.makeText(requireContext(), "Male", Toast.LENGTH_SHORT).show()
            }
            R.id.rbFemale -> {
                txtGender.text = "Gender: Female"
                Toast.makeText(requireContext(), "Female", Toast.LENGTH_SHORT).show()
            }
        }
        txtHello.text = "Hello " + editTextName.text.toString()
        txtName.text = "Name: " + editTextName.text.toString()
        txtAge.text = "Age: " + editTextAge.text.toString()
        txtHeight.text = "Height: " + editTextHeight.text.toString()

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis"
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
                        val message = JSONObject(responseBody).optString("message", "Unauthorized")
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


}