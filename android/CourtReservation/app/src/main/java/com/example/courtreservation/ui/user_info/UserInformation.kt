package com.example.courtreservation.ui.user_info

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentUserInfoBinding
import com.example.courtreservation.ui.login.LoginActivity

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
        Toast.makeText(this.context, "Set User info", Toast.LENGTH_SHORT).show()
    }
}