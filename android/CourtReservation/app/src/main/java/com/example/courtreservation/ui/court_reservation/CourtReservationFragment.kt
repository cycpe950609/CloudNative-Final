package com.example.courtreservation.ui.court_reservation

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentCourtReservationBinding
import com.example.courtreservation.network.FetchDataTask
import org.json.JSONObject

class CourtReservationFragment:Fragment() {
    private var _binding: FragmentCourtReservationBinding? = null
    private val url = "https://cloudnative.eastus.cloudapp.azure.com/menu"

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val courtReservationViewModel =
            ViewModelProvider(this).get(CourtReservationViewModel::class.java)

        _binding = FragmentCourtReservationBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textCourtReservation

        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                var courtJson = JSONObject(jsonResult)
                textView.text = courtJson.getString("name")
            } else {
                null
            }
        }
        courtReservationViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
            fetchMenuTask.execute(url)
        }


        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}