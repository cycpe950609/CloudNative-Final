package com.example.courtreservation

import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.os.bundleOf
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.example.courtreservation.databinding.ActivityMainBinding
import com.example.courtreservation.network.FetchDataTask
import com.example.courtreservation.ui.login.LoginActivity
import com.example.courtreservation.ui.reservation_record.reservation_info
import com.google.android.material.imageview.ShapeableImageView
import com.google.android.material.navigation.NavigationView
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException
import java.lang.reflect.Type

data class next_reserv(
    val remaining_time: Float
)
class MainActivity : AppCompatActivity(), FragmentSwitchListener {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private val CHANNEL_ID = "my_channel"
    private val NOTIFICATION_PERMISSION_CODE = 123

    private val url = "https://cloudnative.eastasia.cloudapp.azure.com/app/stadium_name"
    private val anno_url = "https://cloudnative.eastasia.cloudapp.azure.com/app/announcement"

    private var navController: NavController? = null




    @SuppressLint("ScheduleExactAlarm")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarMain.toolbar)
        //findViewById(R.id.nav_bar)

        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        navController = findNavController(R.id.nav_host_fragment_content_main)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home
            ), drawerLayout
        )
        setupActionBarWithNavController(navController!!, appBarConfiguration)
        navView.setupWithNavController(navController!!)


        val fetchMenuTask = FetchDataTask { jsonResult ->
            // 在这里处理JSON数据
            if (jsonResult != null) {
                var submenu = navView.menu.findItem(R.id.court_menu_item).subMenu

                val listType = object : TypeToken<List<String>>() {}.type

                val stringsList: List<String> = Gson().fromJson(jsonResult, listType)
                println(stringsList)

                for(i in stringsList.indices){
                    submenu?.add(0,R.id.nav_court,i,stringsList[i])
                }
            } else {
                null
            }
        }

        fetchMenuTask.execute(url)

        val headerView = navView.getHeaderView(0)

        var profile_picture = headerView.findViewById<ShapeableImageView>(R.id.imageView)

        profile_picture?.setOnClickListener{
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        //var isLogin = LoginActivity.Usersingleton.username != ""

        //if (isLogin) {
            //var menu = navView.menu
            //var item = menu.add(R.id.nav_matching, Menu.NONE, R.id.nav_matching_record, R.string.menu_matching_record)
            //var item2 = menu.add(R.id.nav_reservation, Menu.NONE, R.id.nav_reservation_record, R.string.menu_court_reservation)
            //var item3 = menu.add(Menu.NONE, Menu.NONE, R.id.nav_user_info, R.string.menu_matching_record)


        //}


        val client = OkHttpClient()
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                // 处理错误
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.byteStream()?.let { inputStream ->
                    val bitmap = BitmapFactory.decodeStream(inputStream)
                    runOnUiThread {
                        profile_picture.setImageBitmap(bitmap)
                    }
                }
            }
        })


        var name_text = headerView.findViewById( R.id.nameText) as TextView
        name_text.text = LoginActivity.Usersingleton.username
        val sharedPref = this.getSharedPreferences("config", Context.MODE_PRIVATE)
        var alarm_is_open = sharedPref.getBoolean("is_open", true)

        if(alarm_is_open){
            var username = LoginActivity.Usersingleton.username

            FetchDataTask{jsonResult ->
                val listType = object : TypeToken<next_reserv>() {}.type

                val stringsList: next_reserv = Gson().fromJson(jsonResult, listType)

                if(stringsList.remaining_time != 0.toFloat()){
                    var alarm_gap = sharedPref.getInt("gap", 30)
                    var time_to_noti = stringsList.remaining_time.toInt() * 1000 - alarm_gap * 60 * 1000
                    if (time_to_noti > 0){
                        val triggerTime = SystemClock.elapsedRealtime() + time_to_noti

                        val intent = Intent(this, NotificationService::class.java)
                        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
                        } else {
                            PendingIntent.FLAG_UPDATE_CURRENT
                        }
                        val pendingIntent = PendingIntent.getService(this, 0, intent, flags)

                        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
                        //alarmManager.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerTime, pendingIntent)
                    }


                }
            }.execute("https://cloudnative.eastasia.cloudapp.azure.com/app/next_reservation/" + username)
        }



    }

    /*override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        MenuCompat.setGroupDividerEnabled(menu, false);
        return false
    }*/

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val notificationPermission = checkSelfPermission("android.permission.VIBRATE")
            if (notificationPermission != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf("android.permission.VIBRATE"), NOTIFICATION_PERMISSION_CODE)
            } else {
                val builder = NotificationCompat.Builder(this, CHANNEL_ID)
                    .setSmallIcon(R.drawable.user_selfie)
                    .setContentTitle("My Notification Title")
                    .setContentText("Hello, this is a notification.")
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)

                with(NotificationManagerCompat.from(this)) {
                    notify(1, builder.build())
                }
            }
        } else {
            val builder = NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.user_selfie)
                .setContentTitle("My Notification Title")
                .setContentText("Hello, this is a notification.")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)

            with(NotificationManagerCompat.from(this)) {
                notify(1, builder.build())
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "My Channel"
            val descriptionText = "My Channel Description"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }

            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    override fun replaceFragmentWithArgs(fragId: Int,args:String) {

        val bundle = bundleOf("args" to args)
        navController?.navigate(fragId,bundle)

    }

    override fun replaceFragment(fragId: Int) {

        navController?.navigate(fragId)

    }
    override fun goBack() {
        navController?.popBackStack()
    }

    override fun setFragmentLabel(label: String){

        val currentDestination = navController?.currentDestination

        currentDestination?.label = label
    }

    override fun getConfig(name:String,type:String,default:String): String {
        val sharedPref = this.getSharedPreferences("config", Context.MODE_PRIVATE)
        if(type == "int"){
            return sharedPref.getInt(name,default.toInt()).toString()
        }else if(type == "string"){
            return sharedPref.getString(name,default).toString()
        }else if(type == "float"){
            return sharedPref.getFloat(name,default.toFloat()).toString()
        }else if(type == "bool"){
            return sharedPref.getBoolean(name,default.toBoolean()).toString()
        }
        return ""
    }

    override fun setConfig(name:String,type:String,value:String){
        val sharedPref = this.getSharedPreferences("config", Context.MODE_PRIVATE)
        val editor = sharedPref.edit()
        if(type == "int"){
            editor.putInt(name,value.toInt())
        }else if(type == "string"){
            editor.putString(name,value)
        }else if(type == "float"){
            editor.putFloat(name,value.toFloat())
        }else if(type == "bool"){
            editor.putBoolean(name,value.toBoolean())
        }
        editor.apply()
    }
}