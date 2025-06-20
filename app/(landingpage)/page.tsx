import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Download,
  Apple,
  Check,
  ChevronDown,
  Star,
  ArrowLeft,
  ArrowRight,
  Users,
  Calendar
} from "lucide-react";

const LandingContent = () => {
  const features = [
    {
      icon: "♻️",
      title: "Manajemen Pengepul",
      description:
        "Kelola pengepul sampah dengan mudah, pantau aktivitas pengumpulan dan transaksi secara real-time."
    },
    {
      icon: "🏠",
      title: "Portal Masyarakat",
      description:
        "Platform mudah bagi masyarakat untuk menjual sampah, melihat harga terkini, dan mencari pengepul terdekat."
    },
    {
      icon: "🏭",
      title: "Pengelola Daur Ulang",
      description:
        "Sistem terintegrasi untuk pengelola fasilitas daur ulang mengelola supply chain dan inventory."
    },
    {
      icon: "📊",
      title: "Analisis & Laporan",
      description:
        "Dashboard lengkap dengan analisis data sampah, tren harga, dan laporan kinerja untuk semua stakeholder."
    },
    {
      icon: "💰",
      title: "Sistem Pembayaran",
      description:
        "Sistem pembayaran terintegrasi yang aman dan transparan untuk semua transaksi dalam ekosistem."
    },
    {
      icon: "🌱",
      title: "Dampak Lingkungan",
      description:
        "Tracking kontribusi lingkungan dan dampak positif dari aktivitas daur ulang yang dilakukan."
    }
  ];

  const pricingPlans = [
    {
      name: "Masyarakat",
      price: 0,
      features: [
        "Daftar dan jual sampah gratis",
        "Cari pengepul terdekat",
        "Tracking harga sampah real-time",
        "Riwayat transaksi lengkap"
      ],
      popular: false
    },
    {
      name: "Pengepul",
      price: 99000,
      features: [
        "Manajemen inventory sampah",
        "Jaringan supplier masyarakat",
        "Dashboard analisis bisnis",
        "Sistem notifikasi otomatis"
      ],
      popular: true
    },
    {
      name: "Pengelola Daur Ulang",
      price: 299000,
      features: [
        "Supply chain management",
        "Quality control system",
        "Production planning tools",
        "Environmental impact reports"
      ],
      popular: false
    }
  ];

  const workSteps = [
    {
      icon: <Download className="h-10 w-10" />,
      title: "Download Aplikasi",
      description:
        "Unduh aplikasi RIjig dari Play Store atau App Store dan daftar sesuai dengan peran Anda."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Lengkapi Profil",
      description:
        "Isi data diri dan verifikasi akun untuk keamanan transaksi dan membangun kepercayaan antar pengguna."
    },
    {
      icon: "🌱",
      title: "Mulai Berkontribusi",
      description:
        "Mulai jual sampah, kelola bisnis pengepulan, atau operasikan fasilitas daur ulang dengan mudah."
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pengepul Sampah",
      avatar: "👨‍💼",
      rating: 5,
      comment:
        "Dengan RIjig, bisnis pengepulan saya jadi lebih terorganisir. Bisa tracking semua transaksi dan jaringan supplier makin luas."
    },
    {
      name: "Sari Wijaya",
      role: "Ibu Rumah Tangga",
      avatar: "👩‍🦰",
      rating: 5,
      comment:
        "Sangat memudahkan untuk jual sampah rumah tangga. Harga transparan dan pengepulnya bisa dipercaya. Tambahan penghasilan yang bagus!"
    },
    {
      name: "PT. Green Recycle",
      role: "Pengelola Daur Ulang",
      avatar: "🏭",
      rating: 5,
      comment:
        "Supply chain management jadi jauh lebih efisien. Bisa monitor kualitas bahan baku dan planning produksi dengan data yang akurat."
    },
    {
      name: "Ahmad Rahman",
      role: "Kepala Lingkungan RT 05",
      avatar: "👨‍🔬",
      rating: 5,
      comment:
        "Lingkungan RT kami jadi lebih bersih sejak menggunakan RIjig. Warga antusias karena sampah bisa jadi uang!"
    }
  ];

  const blogs = [
    {
      title: "5 Jenis Sampah yang Paling Menguntungkan untuk Dijual",
      excerpt:
        "Pelajari jenis-jenis sampah yang memiliki nilai ekonomi tinggi dan cara memilahnya dengan benar untuk mendapatkan harga terbaik.",
      author: "Tim RIjig",
      date: "15 Juni 2025",
      image: "♻️"
    },
    {
      title: "Tips Memulai Bisnis Pengepul Sampah untuk Pemula",
      excerpt:
        "Panduan lengkap untuk memulai bisnis pengepulan sampah, mulai dari modal awal hingga strategi pemasaran yang efektif.",
      author: "Tim RIjig",
      date: "10 Juni 2025",
      image: "💼"
    },
    {
      title: "Dampak Positif Daur Ulang Terhadap Lingkungan Indonesia",
      excerpt:
        "Mengenal lebih dalam bagaimana industri daur ulang berkontribusi dalam mengurangi pencemaran lingkungan di Indonesia.",
      author: "Tim RIjig",
      date: "5 Juni 2025",
      image: "🌱"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="py-20 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto max-w-[1305px] px-4">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Solusi Digital untuk Ekonomi Sirkular
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black dark:text-white leading-tight">
                Platform Terpadu{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Pengelolaan Sampah
                </span>{" "}
                Indonesia
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-[475px]">
                Menghubungkan masyarakat, pengepul, dan pengelola daur ulang dalam satu ekosistem digital untuk ekonomi sirkular yang berkelanjutan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <span className="mr-4 border-r border-green-300 pr-4">
                    Download Sekarang
                  </span>
                  <Apple className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="lg" className="group">
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-current">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm">Lihat Demo</div>
                    <div className="text-xs text-gray-500">
                      Cara kerja aplikasi
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-[530px]">
                <div className="relative bg-gradient-to-br from-green-400 to-blue-600 rounded-full aspect-square">
                  <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl md:text-8xl mb-4">♻️</div>
                      <h3 className="text-xl font-semibold mb-2">RIjig</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Aplikasi pengelolaan sampah
                      </p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-5 right-0 text-4xl">🌱</div>
                  <div className="absolute bottom-10 left-0 text-3xl">💚</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Fitur Lengkap untuk Semua Stakeholder
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Solusi terintegrasi yang menghubungkan masyarakat, pengepul, dan pengelola daur ulang dalam satu platform yang mudah digunakan dan efisien.
            </p>
          </div>

          <Card className="p-6 md:p-12 lg:p-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-3xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1120px] px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-400 to-blue-600 rounded-3xl h-80 md:h-96 flex items-center justify-center">
                <div className="text-white text-6xl md:text-8xl">📊</div>
                <div className="absolute top-5 right-5 text-3xl">📈</div>
                <div className="absolute bottom-10 left-0 text-2xl">♻️</div>
              </div>
            </div>

            <div className="space-y-6">
              <Badge variant="outline" className="text-green-600">
                Pantau Aktivitas Sampah
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                Tracking Real-time Aktivitas Pengelolaan Sampah
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor seluruh aktivitas pengelolaan sampah mulai dari pengumpulan, penjualan, hingga proses daur ulang dengan dashboard yang informatif dan real-time.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 font-semibold">
                    01
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      Volume & Harga Sampah Real-time
                    </h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Pantau volume sampah dan fluktuasi harga di pasar secara langsung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 font-semibold">
                    02
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      Laporan Dampak Lingkungan
                    </h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Lihat kontribusi Anda terhadap pengurangan sampah dan perlindungan lingkungan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second About Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 lg:order-2">
              <Badge variant="outline" className="text-green-600">
                Analisis Data Komprehensif
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                Dapatkan Insight Mendalam tentang Bisnis Sampah
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Analisis data mendalam untuk membantu pengambilan keputusan yang lebih baik dalam pengelolaan sampah dan optimalisasi operasional bisnis.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            <div className="relative lg:order-1">
              <div className="relative bg-gradient-to-br from-orange-400 to-green-600 rounded-3xl h-80 md:h-96 flex items-center justify-center">
                <div className="text-white text-6xl md:text-8xl">📈</div>
                <div className="absolute top-5 right-5 text-3xl">🎯</div>
                <div className="absolute bottom-10 left-0 text-2xl">💡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section id="work-process" className="py-20">
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Bergabung dengan ekosistem pengelolaan sampah yang berkelanjutan hanya dalam 3 langkah mudah dan mulai berkontribusi untuk lingkungan yang lebih bersih.
            </p>
          </div>

          <Card className="p-6 md:p-12 lg:p-16">
            <div className="grid md:grid-cols-3 gap-8">
              {workSteps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    {typeof step.icon === "string" ? (
                      <span className="text-3xl">{step.icon}</span>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1120px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Pilih Paket Sesuai Peran Anda
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Kami menyediakan solusi yang disesuaikan untuk setiap stakeholder dalam ekosistem pengelolaan sampah, dari masyarakat hingga industri daur ulang.
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm font-medium text-black dark:text-white">
                Bulanan
              </span>
              <div className="relative">
                <div className="w-14 h-8 bg-green-600 rounded-full p-1">
                  <div className="w-6 h-6 bg-white rounded-full transition-transform" />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-500">Tahunan</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? "border-green-600 shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                    Paling Populer
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    Paket khusus untuk {plan.name.toLowerCase()} sampah.
                  </CardDescription>
                  <div className="border-b pb-5">
                    <span className="text-4xl font-bold">
                      <sup className="text-xl">Rp</sup>
                      {plan.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-gray-500"> / bulan</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <Button
                    className={`w-full mt-6 ${
                      plan.popular
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-black dark:bg-gray-700 hover:bg-green-600"
                    }`}
                  >
                    Pilih Paket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screens" className="py-20">
        <div className="container mx-auto max-w-[1000px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Screenshot Aplikasi
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Lihat tampilan antarmuka aplikasi RIjig yang user-friendly dan mudah digunakan untuk semua kalangan pengguna.
            </p>
          </div>

          <div className="relative">
            {/* Screenshots Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "🏠", title: "Dashboard Masyarakat" },
                { icon: "📊", title: "Panel Pengepul" },
                { icon: "🏭", title: "Sistem Daur Ulang" }
              ].map((screen, index) => (
                <div key={index} className="mx-auto max-w-[265px]">
                  <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl aspect-[9/19] flex items-center justify-center overflow-hidden">
                    <div className="text-center p-4">
                      <div className="text-4xl md:text-6xl mb-4">{screen.icon}</div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {screen.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1390px] px-4">
          <Card className="p-6 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                  Download RIjig Sekarang & Mulai Kelola Sampah dengan Bijak
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat ekonomi dan lingkungan dari pengelolaan sampah yang lebih baik.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <span className="mr-2 text-2xl">📱</span>
                    <div className="text-left">
                      <div className="text-xs opacity-70">Download di</div>
                      <div className="text-sm font-medium">Google Play</div>
                    </div>
                  </Button>
                  <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black">
                    <Apple className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="text-xs opacity-70">Download dari</div>
                      <div className="text-sm font-medium">App Store</div>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-gradient-to-br from-green-400 to-blue-600 rounded-full aspect-square">
                  <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl md:text-8xl mb-4">📲</div>
                      <h3 className="text-xl font-semibold mb-2">RIjig App</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Download sekarang
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 text-3xl">🌱</div>
                  <div className="absolute bottom-0 left-0 text-2xl">♻️</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto max-w-[1160px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Apa Kata Pengguna Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Testimoni dari berbagai stakeholder yang telah merasakan manfaat nyata dari penggunaan platform RIjig dalam kehidupan sehari-hari.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="border-b pb-6 mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    "{testimonial.comment}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {testimonial.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{testimonial.rating}</span>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[785px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Temukan jawaban atas pertanyaan umum tentang RIjig dan cara kerja platform pengelolaan sampah terintegrasi kami.
            </p>
          </div>

          <Card className="divide-y">
            {[
              {
                question: "Apakah aplikasi RIjig gratis untuk digunakan?",
                answer: "Ya, untuk masyarakat umum aplikasi ini sepenuhnya gratis. Pengepul dan pengelola daur ulang dapat memilih paket berlangganan sesuai kebutuhan bisnis mereka."
              },
              {
                question: "Bagaimana cara menentukan harga sampah yang fair?",
                answer: "Kami menggunakan algoritma pricing yang mempertimbangkan harga pasar real-time, kualitas sampah, volume, dan lokasi untuk memastikan harga yang adil bagi semua pihak."
              },
              {
                question: "Apakah transaksi di RIjig aman dan terpercaya?",
                answer: "Sangat aman. Kami menggunakan sistem escrow untuk pembayaran, verifikasi identitas pengguna, dan rating system untuk membangun kepercayaan dalam ekosistem."
              }
            ].map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <span className="font-medium text-black dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown className="h-5 w-5 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 border-t">
                  <p className="text-gray-600 dark:text-gray-300 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Artikel & Tips Terbaru
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Pelajari lebih lanjut tentang pengelolaan sampah, tips bisnis pengepulan, dan informasi terkini seputar industri daur ulang di Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl md:text-6xl text-white">
                      {blog.image}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <div className="flex flex-wrap items-center gap-4 text-white text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-black dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Baca Selengkapnya
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
              Dipercaya oleh Partner Terbaik
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[
              "Dinas LH DKI",
              "Bank Sampah ID",
              "Green Indonesia",
              "Recycle Corp",
              "Eco Partner",
              "Waste Management"
            ].map((client, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto opacity-65 hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium">{client}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="support" className="py-20">
        <div className="container mx-auto max-w-[925px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Mari Terhubung dengan Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Punya pertanyaan atau ingin bermitra dengan RIjig? Hubungi tim kami dan mari bersama-sama membangun ekosistem pengelolaan sampah yang berkelanjutan.
            </p>
          </div>

          <Card className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input placeholder="Masukkan nama Anda" />
                <Input placeholder="Nama perusahaan (opsional)" />
                <Input type="email" placeholder="Masukkan email Anda" />
                <Input placeholder="Nomor telepon" />
              </div>
              <Textarea rows={6} placeholder="Ceritakan tentang Anda dan bagaimana kami bisa membantu" />
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dengan mengklik tombol hubungi kami, Anda menyetujui syarat dan ketentuan yang berlaku
                </p>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Hubungi Kami
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};

export default LandingContent;