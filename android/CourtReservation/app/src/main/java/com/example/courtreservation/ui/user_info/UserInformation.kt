package com.example.courtreservation.ui.user_info

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentUserInfoBinding

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
        var bt1: Button = binding.button
        bt1.setOnClickListener{
            bt1click(view)
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

    private fun bt1click(view: View?) {
        val txtHello: TextView = binding.textView2
        val txtName: TextView = binding.ShowName
        val txtHeight: TextView = binding.ShowHeight
        val editTextName: EditText = binding.editTextName
        val editTextHeight: EditText = binding.editTextHeight
        txtHello.text = "Hello " + editTextName.text.toString()
        txtName.text = "Name: " + editTextName.text.toString()
        txtHeight.text = "Height: " + editTextHeight.text.toString()
        Toast.makeText(this.context, "Set User info", Toast.LENGTH_SHORT).show()
    }
}