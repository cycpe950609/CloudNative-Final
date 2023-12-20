package com.example.courtreservation.ui.court_info

import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.NumberPicker
import androidx.fragment.app.Fragment
import com.example.courtreservation.databinding.FragmentCourtInfoBinding
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.Calendar

class CourtInformationFragment: Fragment() {
    private var _binding: FragmentCourtInfoBinding? = null

    // This property is only valid between onCreateView and onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentCourtInfoBinding.inflate(inflater, container, false)

        // 使用 binding 对象来引用布局中的组件

        val calendar = Calendar.getInstance()
        val currentYear = calendar.get(Calendar.YEAR)
        val currentMonth = calendar.get(Calendar.MONTH) + 1 // 月份从0开始计算，所以加1
        val currentDay = calendar.get(Calendar.DAY_OF_MONTH)
        setNumberPicker(binding.numberPickerYear, currentYear, currentYear, 2030)
        setNumberPicker(binding.numberPickerMonth, currentMonth, 1, 12)
        setNumberPicker(binding.numberPickerDay, currentDay, 1, 31)
        displaySelectedDate()
        fetchMaxCapacity()
        binding.numberPickerYear.setOnValueChangedListener { _, _, _ -> displaySelectedDate()
            checkStadiumAvailability()}
        binding.numberPickerMonth.setOnValueChangedListener { _, _, _ -> displaySelectedDate()
            checkStadiumAvailability()}
        binding.numberPickerDay.setOnValueChangedListener { _, _, _ -> displaySelectedDate()
            checkStadiumAvailability()}

        binding.button7to8.setOnClickListener { onTimeButtonClicked("7:00 - 8:00")
            checkStadiumAvailability()}
        binding.button8to9.setOnClickListener { onTimeButtonClicked("8:00 - 9:00")
            checkStadiumAvailability()}
        binding.button9to10.setOnClickListener { onTimeButtonClicked("9:00 - 10:00")
            checkStadiumAvailability()}
        binding.button10to11.setOnClickListener { onTimeButtonClicked("10:00 - 11:00")
            checkStadiumAvailability()}
        binding.button11to12.setOnClickListener { onTimeButtonClicked("11:00 - 12:00")
            checkStadiumAvailability()}
        binding.button12to13.setOnClickListener { onTimeButtonClicked("12:00 - 13:00")
            checkStadiumAvailability()}
        binding.button13to14.setOnClickListener { onTimeButtonClicked("13:00 - 14:00")
            checkStadiumAvailability()}
        binding.button14to15.setOnClickListener { onTimeButtonClicked("14:00 - 15:00")
            checkStadiumAvailability()}
        binding.button15to16.setOnClickListener { onTimeButtonClicked("15:00 - 16:00")
            checkStadiumAvailability()}
        binding.button16to17.setOnClickListener { onTimeButtonClicked("16:00 - 17:00")
            checkStadiumAvailability()}
        binding.button17to18.setOnClickListener { onTimeButtonClicked("17:00 - 18:00")
            checkStadiumAvailability()}
        binding.button18to19.setOnClickListener { onTimeButtonClicked("18:00 - 19:00")
            checkStadiumAvailability()}
        binding.button19to20.setOnClickListener { onTimeButtonClicked("19:00 - 20:00")
            checkStadiumAvailability()}
        binding.button20to21.setOnClickListener { onTimeButtonClicked("20:00 - 21:00")
            checkStadiumAvailability()}
        binding.button21to22.setOnClickListener { onTimeButtonClicked("21:00 - 22:00")
            checkStadiumAvailability()}
        return binding.root
    }

    private fun setNumberPicker(numberPicker: NumberPicker, currentValue: Int, minValue: Int, maxValue: Int) {
        numberPicker.minValue = minValue
        numberPicker.maxValue = maxValue
        numberPicker.value = currentValue
    }
    private fun onTimeButtonClicked(time: String) {
        binding.textViewShowtime.text = time
    }
    private fun displaySelectedDate() {
        val selectedYear = binding.numberPickerYear.value
        val selectedMonth = binding.numberPickerMonth.value
        val selectedDay = binding.numberPickerDay.value

        // Format the date. Adjust the format as needed.
        val formattedDate = "$selectedYear-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}"
        binding.textViewShowdate.text = formattedDate
    }
    private fun getDayOfWeek(year: Int, month: Int, day: Int): String {
        val calendar = Calendar.getInstance()
        // 注意：在 Calendar 中月份是从 0 开始的，所以需要减 1
        calendar.set(year, month - 1, day)

        return when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.SUNDAY -> "星期日"
            Calendar.MONDAY -> "星期一"
            Calendar.TUESDAY -> "星期二"
            Calendar.WEDNESDAY -> "星期三"
            Calendar.THURSDAY -> "星期四"
            Calendar.FRIDAY -> "星期五"
            Calendar.SATURDAY -> "星期六"
            else -> "未知"
        }
    }
    private fun fetchMaxCapacity() {
        val courtId = 1
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/get_max_capacity?court_id=$courtId"

        FetchMaxCapacityTask().execute(url)
    }
    private inner class FetchMaxCapacityTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg urls: String): String {
            val url = URL(urls[0])
            return with(url.openConnection() as HttpURLConnection) {
                requestMethod = "GET"
                inputStream.bufferedReader().use { it.readText() }
            }
        }

        override fun onPostExecute(result: String) {
            val jsonResponse = JSONObject(result)
            val maxCapacity = jsonResponse.optInt("max_capacity", -1)
            if (maxCapacity != -1) {
                binding.textViewShowmaxcapacity.text = "$maxCapacity"
            } else {
                // 处理错误或没有找到的情况
                binding.textViewShowmaxcapacity.text = "无法获取最大容量"
            }
        }
    }
    private fun checkStadiumAvailability() {
        val year = binding.numberPickerYear.value
        val month = binding.numberPickerMonth.value
        val day = binding.numberPickerDay.value
        val dayOfWeek = getDayOfWeekNumber(year, month, day)
        val stadium_id = 2
        val time = binding.textViewShowtime.text.toString()
        val hour = time.split(":")[0].toInt() // Assuming time format is "HH:MM - HH:MM"

        val jsonBody = JSONObject().apply {
            put("dayOfWeek", dayOfWeek)
            put("hour", hour)
            put("stadiumID", stadium_id)
        }

        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/check_availability"

        CheckAvailabilityTask().execute(url, jsonBody.toString())
    }
    private inner class CheckAvailabilityTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg params: String): String {
            val urlString = params[0]
            val jsonBodyString = params[1]

            val url = URL(urlString)
            return with(url.openConnection() as HttpURLConnection) {
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                outputStream.write(jsonBodyString.toByteArray())

                inputStream.bufferedReader().use { it.readText() }
            }
        }

        override fun onPostExecute(result: String) {
            val jsonResponse = JSONObject(result)
            val isAvailable = jsonResponse.getBoolean("is_available")
            binding.textViewShowavailable.text = if (isAvailable) "可用" else "不可用"
        }
    }
    private fun getDayOfWeekNumber(year: Int, month: Int, day: Int): Int {
        val calendar = Calendar.getInstance()
        calendar.set(year, month - 1, day)
        return when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.SUNDAY -> 7
            Calendar.MONDAY -> 1
            Calendar.TUESDAY -> 2
            Calendar.WEDNESDAY -> 3
            Calendar.THURSDAY -> 4
            Calendar.FRIDAY -> 5
            Calendar.SATURDAY -> 6
            else -> 0 // 0 表示未知
        }
    }
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}