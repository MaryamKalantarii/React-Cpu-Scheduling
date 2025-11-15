import React from "react";
import { useTranslation } from "react-i18next";
import "./BlogNeon.css";

const algorithms = [
  {
    name: { en: "FIFO", fa: "FIFO" },
    description: {
      en: "Processes are executed in the order they arrive. Simple, but may cause long waiting times for some processes.",
      fa: "پردازه‌ها به ترتیب ورود اجرا می‌شوند. ساده است، اما ممکن است باعث طولانی شدن زمان انتظار برخی پردازه‌ها شود."
    }
  },
  {
    name: { en: "SJF", fa: "SJF" },
    description: {
      en: "The process with the shortest CPU burst time is selected first. Reduces average waiting time but requires knowledge of process lengths.",
      fa: "پردازه‌ای که کوتاه‌ترین زمان اجرای CPU را دارد ابتدا انتخاب می‌شود. میانگین زمان انتظار را کاهش می‌دهد اما نیاز به دانستن طول پردازه‌ها دارد."
    }
  },
  {
    name: { en: "SRT", fa: "SRT" },
    description: {
      en: "Preemptive version of SJF. A newly arrived shorter process can interrupt the running process.",
      fa: "نسخه پیش‌گیرانه SJF است. پردازه‌ای که تازه وارد شده و زمان کوتاه‌تری دارد می‌تواند پردازه در حال اجرا را متوقف کند."
    }
  },
  {
    name: { en: "LJF", fa: "LJF" },
    description: {
      en: "The process with the longest burst time is selected. Rarely used.",
      fa: "پردازه‌ای که بیشترین زمان اجرا را دارد انتخاب می‌شود. به ندرت استفاده می‌شود."
    }
  },
  {
    name: { en: "RLTF", fa: "RLTF" },
    description: {
      en: "Preemptive version of LJF where a longer process can interrupt the current process.",
      fa: "نسخه پیش‌گیرانه LJF که پردازه طولانی‌تر می‌تواند پردازه فعلی را متوقف کند."
    }
  },
  {
    name: { en: "RR", fa: "Round Robin" },
    description: {
      en: "Each process is given a time quantum. If not finished, it goes to the end of the queue.",
      fa: "به هر پردازه یک بازه زمانی اختصاص داده می‌شود. اگر کامل نشود، به انتهای صف منتقل می‌شود."
    }
  },
  {
    name: { en: "Non-Preemptive", fa: "Non-Preemptive" },
    description: {
      en: "The current process runs to completion before the next process is scheduled.",
      fa: "پردازه جاری تا پایان اجرا می‌شود و سپس پردازه بعدی زمان‌بندی می‌شود."
    }
  },
  {
    name: { en: "Multilevel Queue (MLQ)", fa: "صف‌بندی چندسطحی (MLQ)" },
    description: {
      en: "Processes are divided into multiple queues, each with its own scheduling policy.",
      fa: "پردازه‌ها به چندین صف تقسیم می‌شوند و هر صف سیاست زمان‌بندی مخصوص خود را دارد."
    }
  },
  {
    name: { en: "Multilevel Feedback Queue (MLFQ)", fa: "صف‌بندی چندسطحی با بازخورد (MLFQ)" },
    description: {
      en: "Processes move between queues to achieve fairer scheduling.",
      fa: "پردازه‌ها بین صف‌ها جابه‌جا می‌شوند تا زمان‌بندی عادلانه‌تری ایجاد شود."
    }
  },
  {
    name: { en: "Earliest Deadline First (EDF)", fa: "نزدیک‌ترین مهلت (EDF)" },
    description: {
      en: "The process with the closest deadline is executed first. Suitable for real-time systems.",
      fa: "پردازه‌ای که نزدیک‌ترین مهلت را دارد، ابتدا اجرا می‌شود. مناسب سیستم‌های زمان واقعی."
    }
  },
  {
    name: { en: "Fixed Priority Preemptive Scheduling (FPPS)", fa: "اولویت ثابت پیش‌گیرانه (FPPS)" },
    description: {
      en: "Processes with higher fixed priority can preempt lower priority processes.",
      fa: "پردازه‌هایی با اولویت ثابت بالاتر می‌توانند پردازه‌های با اولویت پایین‌تر را متوقف کنند."
    }
  },
  {
    name: { en: "Highest Response Ratio Next (HRRN)", fa: "بیشترین نسبت پاسخ (HRRN)" },
    description: {
      en: "The process with the highest response ratio (waiting time + burst time / burst time) is executed next.",
      fa: "پردازه‌ای که بیشترین نسبت پاسخ (زمان انتظار + زمان اجرا / زمان اجرا) دارد، بعدی اجرا می‌شود."
    }
  }
];

const BlogNeon = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="blog-neon-container">
      <h1 className="blog-title">{t("CPU Scheduling Algorithms")}</h1>
      <div className="cards-container">
        {algorithms.map((algo, index) => (
          <div key={index} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">{algo.name[i18n.language]}</div>
              <div className="flip-card-back">{algo.description[i18n.language]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogNeon;
