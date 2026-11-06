# kotlinx.serialization
-keepattributes *Annotation*, InnerClasses, Signature, Exceptions
-dontnote kotlinx.serialization.**
-keepclassmembers class kotlinx.serialization.json.** { *** Companion; }
-keep,includedescriptorclasses class ci.cyberpost.app.**$$serializer { *; }
-keepclassmembers class ci.cyberpost.app.** { *** Companion; }
-keepclasseswithmembers class ci.cyberpost.app.** { kotlinx.serialization.KSerializer serializer(...); }
# Retrofit
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class retrofit2.Response
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation
-keep interface ci.cyberpost.app.data.remote.CyberPostApi { *; }
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**
