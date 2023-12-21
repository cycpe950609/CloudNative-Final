package com.example.courtreservation.ui.friend_list

import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentFriendListBinding
import com.example.courtreservation.ui.gallery.GalleryViewModel
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class FriendsListFragment : Fragment() {
    private var _binding: FragmentFriendListBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentFriendListBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Assuming username is available somehow (e.g., from a singleton or passed argument)
        fetchFriends("yourUsername")

        return root
    }

    private fun fetchFriends(username: String) {
        val url = "https://cloudnative.eastasia.cloudapp.azure.com/curtis/get_friends?username=$username"
        FetchFriendsTask().execute(url)
    }

    private inner class FetchFriendsTask : AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg urls: String): String? {
            try {
                val url = URL(urls[0])
                with(url.openConnection() as HttpURLConnection) {
                    requestMethod = "GET"
                    return inputStream.bufferedReader().use { it.readText() }
                }
            } catch (e: IOException) {
                e.printStackTrace()
                return null
            }
        }
        override fun onPostExecute(result: String?) {
            super.onPostExecute(result)
            if (result != null) {
                try {
                    val jsonResponse = JSONObject(result)
                    val friends = jsonResponse.getJSONArray("friends")
                    displayFriends(friends)
                } catch (e: JSONException) {
                    e.printStackTrace()
                    Toast.makeText(context, "Error parsing response: ${e.message}", Toast.LENGTH_LONG).show()
                }
            } else {
                Toast.makeText(context, "Network request failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun displayFriends(friends: JSONArray) {
        val linearLayout = binding.linearLayoutFriends
        linearLayout.removeAllViews()

        for (i in 0 until friends.length()) {
            val friend = friends.getJSONObject(i)
            val userName = friend.getString("user_name")
            val age = friend.getInt("age")
            val gender = friend.getString("gender")
            val height = friend.getInt("height")

            val friendView = TextView(context).apply {
                text = "Name: $userName, Age: $age, Gender: $gender, Height: $height"
                layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            }
            linearLayout.addView(friendView)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}